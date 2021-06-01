import { mongodbPath, token } from "./src/config";
import { Telegraf, Markup } from "telegraf";
import mongoose from "mongoose";
import { Keyboard } from "./src/common/bot-keyboard.enum";
import { accessMiddleware } from "./src/middleware/access.middleware";
import { forwardFromMiddleware } from "./src/middleware/forward-from.middleware";
import { gangUpdate } from "./src/utils/gang-update";
import { pipHandle } from "./src/utils/pip-handle";
import { goatManager } from "./src/utils/goat-manager";

mongoose.set("useCreateIndex", true);
const bot = new Telegraf(token);

bot.start(greeting, testKeyboard);
bot.hears([/(.*),.*\n/, /👤(.*)/], forwardFromMiddleware, pipHandle);
bot.hears(/Панель банды./, forwardFromMiddleware, accessMiddleware, gangUpdate);
bot.hears(/Панель козла/,
    forwardFromMiddleware, accessMiddleware, goatManager);
bot.command("keyboard", accessMiddleware, testKeyboard);
bot.command("help", ctx => {
    ctx.reply("Тут пока ничего нет, мне лень писать хелпу");
})
bot.command("me", async ctx => {

    await ctx.reply("не надо мне пока писать эту команду");
});
bot.on("text", textMessageParser);



async function textMessageParser(ctx, next) {
    switch (ctx.message.text) {
        case  Keyboard.Ping :
            console.log("ping");
            break;

    }
    next();
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



