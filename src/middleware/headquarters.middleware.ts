import { Context } from "telegraf";

export const headquartersMiddleware=async (ctx: Context, next)=>{
    if (ctx.chat.id===1001261139792){
        await ctx.reply('Ура, меня закинули в штаб, чуть позже я выдам вам роли для управления рейдами');
        next()
    }

}