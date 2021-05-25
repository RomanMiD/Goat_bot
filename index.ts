import {mongodbPath, token} from './src/config';
import {Telegraf} from 'telegraf';
import {parsePip} from "./src/utils/pipBoy-parser";
import mongoose from "mongoose";

mongoose.set('useCreateIndex', true);

const bot = new Telegraf(token);

bot.start(async (ctx) => {
    await ctx.reply('Привет, отправь мне свой полный пип-бой через /me и тогда поговорим');

});
//
bot.hears(/(.*),.*\n/, async (ctx) => {
    console.log(await pipHandle(ctx))

});

function pipHandle(ctx) {
    if(ctx.message.forward_from){
        if (ctx.message.forward_from.id == 430930191) {
            //@ts-ignore
            const data = parsePip({text: ctx.message.text, forward_date: ctx.message.forward_date},
                true);
            const userData = {username: ctx.from.username, id: ctx.from.id};
            ctx.reply('Будем знакомы, шо');
            return {data, userData};
        }
        ctx.reply('Ты втираешь какую-то дичь')
    }

}


// async function saveDoc(ctx) {
//     const docId = ctx.message.document.file_id;
//     const caption = ctx.message.caption || null;
//     let docData = {docId, caption, from: {id: ctx.message.from.id}};
//     let doc = await UserDocModel.findOne({docId});
//     if (!doc) {
//         try {
//             doc = await new UserDocModel(docData).save()
//
//         } catch (e) {
//             doc = await UserDocModel.findOne({docId})
//         }
//         return doc
// }}


mongoose.connect(`${mongodbPath}/OST`, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        bot.launch().then(() => {
            console.log('started')
        })
    });


// const UserDocModel = model('Docs', UserDocSchema);
// const userModel = model('Users', userSchema);
//
// async function findUser(ctx) {
//     const id = ctx.message.from.id
//     const userData = {id, username: ctx.message.from.username}
//     let user = await userModel.findOne({id})
//     if (!user) {
//         try {
//             user = await new userModel(userData).save()
//         } catch (err) {
//             user = await userModel.findOne({id})
//         }
//     }
//     return user
// }
//

//
// async function savePhoto(ctx) {
//     const photoId = ctx.message.document.file_id;
//     const caption = ctx.message.caption || null;
//     let docData = {photoId, caption, from: {id: ctx.message.from.id}};
//     let photoDoc = await UserDocModel.findOne({photoId});
//     if (!photoDoc) {
//         try {
//             photoDoc = await new UserDocModel(docData).save()
//
//         } catch (e) {
//             photoDoc = await UserDocModel.findOne({photoId})
//         }
//         return photoDoc
//     }}
//

