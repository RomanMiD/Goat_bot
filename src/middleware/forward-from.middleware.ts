export const forwardFromMiddleware =async (ctx, next)=>{
    if (ctx.message.forward_from) {
        if (ctx.message.forward_from.id == 430930191){
            next();
        }else{
           await ctx.reply('Ты где это взял? А ну-ка притащи мне сообщение из игрового бота');
        }
    }else{
        await ctx.reply(`Такие штуки я хочу видеть пересланными из игрового бота`)
    }

}