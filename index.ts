import { mongodbPath, token } from "./src/config";
import { Telegraf, Markup, Context } from "telegraf";
import { parsePip } from "./src/utils/pipBoy-parser";
import mongoose from "mongoose";
import { PipBoyStatsModel, UserModel } from "./src/models/userModel";
import { accessMiddleware } from "./src/middleware/access.middleware";
import { Role } from "./src/common/role.enum";
import { Keyboard } from "./src/common/bot-keyboard.enum";

mongoose.set("useCreateIndex", true);

const bot = new Telegraf(token);

bot.start(greeting, testKeyboard);

bot.hears([/(.*),.*\n/, /👤(.*)/], pipHandle);
bot.hears(/Панель банды./, async ctx=>{
    const crewLeadRegExp = /⚜️ \n*(.*)\n/;
    const gangRegExp = /🤘 (.*) 🏅(\d*)/;
    const crewLeader = crewLeadRegExp.exec(ctx.message.text)[1];
    const gang = gangRegExp.exec(ctx.message.text)[1];
    console.log(crewLeader)
    //если чувак с панельки лидер- то и чувак с этой модели должен иметь роль  лидера
    const leaderDocument= await UserModel.findOne({nickname: crewLeader, gang });
    console.log(leaderDocument)
    if (leaderDocument){
        console.log('works')
        leaderDocument.role = Role.CrewLeader;
        await leaderDocument.save();
        //const res = await Person.updateOne({ name: 'Jean-Luc Picard' }, { ship: 'USS Enterprise' });
        // res.n; // Number of documents matched
        // res.nModified; // Number of documents modified
        ctx.reply(`Здравия ${crewLeader}, самому справедливому лидеру ${gang}`)
    }
    // console.log(crewLeader[1]);
    // ctx.reply(`${crewLeader[1]}`);
    // UserModel.findOne({gang:})
    });
bot.command("keyboard", accessMiddleware, testKeyboard)

bot.command("gm", ctx => {
});
bot.command("help", ctx => {
    ctx.reply("Тут пока ничего нет, мне лень писать хелпу")
})
bot.command("me", async ctx => {

    await ctx.reply('не надо мне пока писать эту команду')
});
bot.on("text", textMessageParser)

async function textMessageParser(ctx, next) {
    console.log(ctx.message.text)
    switch (ctx.message.text){
        case  Keyboard.Ping :
            console.log('ping')
            break;

    }
    next()
}

export async function pipHandle(ctx) {
    if (ctx.message.forward_from) {
        if (ctx.message.forward_from.id == 430930191) {
            const isClassic = ctx.message.text.search(/(.*),.*\n/) >= 0;
            try {
                const data = parsePip({text: ctx.message.text, forward_date: ctx.message.forward_date}, isClassic);
                const userData = {username: ctx.from.username, tgId: ctx.from.id, gang: data?.gang};
                // на чужом пип-бое не должен найтись документ
                const userDocument = await UserModel.findOne({tgId: ctx.from.id});
                if (userDocument?.nickname== data.name){
                    console.log('match!')
                }
                // Если такого челика нет- сохраняет документ
                if (!userDocument) {

                    const bandit = new UserModel({
                        username: userData.username,
                        nickname: data.name,
                        tgId: userData.tgId,
                        role: Role.Solder,
                        gang: data?.gang
                    });
                    bandit.save().catch(err => {
                        console.log(err)
                    })
                }
                //Записывает пип-бой
                await new PipBoyStatsModel({...data, userId: userData.tgId}).save();
                await ctx.reply('Я не буду молчать, если мне придет пип-бой')
            } catch (e) {
                console.log(e);
            }


        }
    }

}

async function getPip(ctx, next) {
    const {id} = ctx.message.from;
    const userDocument = await UserModel.findOne({tgId: id})
    ctx.reply(`${userDocument.getPips()}`)
    next()
}

function greeting(ctx, next) {
    ctx.reply("Привет, отправь мне свой полный пип-бой через /me и тогда поговорим");
    next()
}

async function testKeyboard(ctx, next) {
   const {Profile, Raid, Compare, Ping} = Keyboard
    await ctx.reply("test keyboard", Markup
        .keyboard([[Profile, Raid], [Compare],[Ping]])
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



