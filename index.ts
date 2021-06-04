import { mongodbPath, token } from "./src/config";
import { Markup, Telegraf } from "telegraf"
import mongoose from "mongoose";
import { Keyboard } from "./src/common/bot-keyboard.enum";
import { accessMiddleware, pinAccessMiddleware } from "./src/middleware/access.middleware";
import { forwardFromMiddleware } from "./src/middleware/forward-from.middleware";
import { gangUpdate } from "./src/utils/gang-update";
import { pipHandle } from "./src/utils/pip-handle";
import { goatManager } from "./src/utils/goat-manager";
import { UserDocument, UserModel } from "./src/models/userModel";
import { Role } from "./src/common/role.enum";
import { expireMiddleware } from "./src/middleware/expire.middleware";
import { GoatModel } from "./src/models/goatModel";
import { GangModel } from "./src/models/gangModel";


mongoose.set("useCreateIndex", true);
const bot = new Telegraf(token);

bot.start(greeting, testKeyboard);
bot.hears([/(.*),.*\n/, /👤(.*)/], forwardFromMiddleware, expireMiddleware, pipHandle);
bot.hears(/Панель банды./, forwardFromMiddleware, accessMiddleware, gangUpdate);
bot.hears(/Панель козла/,
    forwardFromMiddleware, accessMiddleware, goatManager);
bot.command("keyboard", accessMiddleware, testKeyboard);
bot.command("help", ctx => {
    ctx.reply("Тут пока ничего нет, мне лень писать хелпу");
})

bot.hears("Профиль", async ctx => {
    ctx.reply(`${ctx.chat.id === ctx.message.from.id}`)
    // const UserDocument = await UserModel.findOne({tgId: ctx.message.from.id})
    // const me = await UserDocument.getMe();
    // const pips = await PipBoyStatsModel.find({userId: ctx.message.from.id}).sort("-createdAt").limit(5);
    // const pipsDates = pips.map(pip=> {
    //     //@ts-ignore
    //     //@ts-ignore
    //     const date = new Date(pip.createdAt)
    //     return date.getFullYear()+'-' + (date.getMonth()+1) + '-'+date.getDate()
    //
    // })
    // ctx.reply(JSON.stringify(pipsDates))

});


bot.hears(`${Keyboard.Raid}`, pinAccessMiddleware, async ctx => {
    const goat = await GoatModel.findOne({gangs: "Страдания Андеда"});
    const gangsInlineKeyboardButton = goat.gangs.map((gang, index) => Markup.button.callback(gang, `gang ${index}`))
    const buttons = Markup.inlineKeyboard([gangsInlineKeyboardButton])
    await ctx.reply("Заглушка", buttons);
    await bot.action(/gang [0-9]/, async ctx => {
        const back = Markup.button.callback("back", "back")
        const chooseGang = ctx.match[0].split(" ")[1]
        const goatGang = goat.gangs[chooseGang]
        console.log(goatGang)
        if (goatGang) {
            const {members} = await GangModel.findOne({name: goatGang});
            console.log(members)
            let membersInlineKeyboard = members
                .map((member) => Markup.button
                    .callback(`${member}`, `${member}`));
            membersInlineKeyboard = splitKeyboardArr(membersInlineKeyboard, 3, back);
            console.log(membersInlineKeyboard)
            ctx.reply(`банда ${goat.gangs[chooseGang]}`,

                Markup.inlineKeyboard(membersInlineKeyboard))
            await ctx.answerCbQuery(`ok`);
            return;
        }

        ctx.reply("C этой бандой определенно что-то не то")


    })
})

function splitKeyboardArr(arr, size = 2, otherButtons) {
    let subarray = []; //массив в который будет выведен результат.
    for (let i = 0; i < Math.ceil(arr.length / size); i++) {
        subarray[i] = arr.slice((i * size), (i * size) + size);
    }
    subarray.push(otherButtons);
    console.log(subarray)
    return subarray
}

bot.on("text", textMessageParser);


async function textMessageParser(ctx, next) {
    const {text} = ctx.message
    switch (text) {
        case  Keyboard.Ping :
            console.log("ping", ctx.message.from);
            await pingLeader(await findLeader("Roman"))
            break;
    }
}

function findLeader(nickname) {
    const isLeaderOrSome = Role.Vice || Role.Tsar || Role.CrewLeader
    return UserModel.findOne({nickname, role: isLeaderOrSome});

}

async function pingLeader(leader: UserDocument) {
    await bot.telegram.sendMessage("309042630", "xui").then().catch(reason => {
        console.log(reason)
    })

    ;
}

function greeting(ctx, next) {
    ctx.reply("Привет, отправь мне свой полный пип-бой через /me и тогда поговорим");
    next()
}

async function testKeyboard(ctx, next) {
    const {Profile, Raid, Compare, Ping} = Keyboard
    await ctx.reply("Будешь кнопочки нажимать, или делом заниматься?", Markup
        .keyboard([[Profile, Raid], [Compare], [Ping]])
        .oneTime()
        .resize())
    next();
}


mongoose.connect(`${mongodbPath}/OST`, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        bot.launch().then(() => {
            console.log("started")
        })
    });






