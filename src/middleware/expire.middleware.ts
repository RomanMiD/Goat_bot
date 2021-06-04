
export const expireMiddleware = (ctx,next)=>{
    console.log(ctx.message.date- ctx.message.forward_date);
    if(ctx.message.date- ctx.message.forward_date> 180){
        ctx.reply('Слишком старая запись, давай посвежее');
        return;
    }

    next();
}