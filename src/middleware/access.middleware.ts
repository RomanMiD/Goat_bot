import { Context } from "telegraf";
import { UserModel } from "../models/userModel";
import { Role } from "../common/role.enum";

export const accessMiddleware = async (ctx: Context, next) => {
    const userId = ctx.message.from.id;
    const foundUser = await UserModel.findOne({tgId: userId});

    if (foundUser.role) {
        await ctx.reply("welcome")
        next();
    } else {
        await ctx.reply("Ты точно скинул мне /me из игрового бота? Хочешь кнопочки нажимать, то будь добр сделать это")
    }

}

export const pinAccessMiddleware = async (ctx: Context, next) => {
    const userId = ctx.message.from.id;
    // @ts-ignore
    const foundUser = await UserModel.findOne({tgId: userId})
    if (foundUser.role === Role.Tsar || foundUser.role === Role.CrewLeader || foundUser.role === Role.Vice) {
        next();
        return;
    }

    ctx.reply("У тебя здесь нет власти").then(value => value);
}