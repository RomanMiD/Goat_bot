import { Context } from "telegraf";
import { UserModel } from "../models/userModel";

export const accessMiddleware = async(ctx: Context, next )=>{
    const userId = ctx.message.from.id;
    const foundUser = await UserModel.findOne({tgId: userId});
    if (foundUser.role){

        next();
    }else{
        await ctx.reply('Я тебя не знаю, пошел знакомиться со мной (присылай /me из игрового бота сюда)')
    }

}