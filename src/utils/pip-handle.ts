import { parsePip } from "./pipBoy-parser";
import { PipBoyStatsModel, UserModel } from "../models/userModel";
import { Role } from "../common/role.enum";

export async function pipHandle(ctx) {
    const isClassic = ctx.message.text.search(/(.*),.*\n/) >= 0;
    try {
        const data = parsePip({
                text: ctx.message.text,
                forward_date: ctx.message.forward_date
            },
            isClassic);
        const userData = {username: ctx.from.username, tgId: ctx.from.id, gang: data?.gang};
        const userDocument = await UserModel.findOne({tgId: ctx.from.id});
        if (!userDocument) {
            // Если такого челика нет- сохраняет юзер
            const bandit = new UserModel({
                username: userData.username,
                nickname: data.name,
                tgId: userData.tgId,
                role: Role.Solder,
                gang: data?.gang
            });
            bandit.save().catch(err => {
                console.log(err)
            });
            await new PipBoyStatsModel({...data, userId: userData.tgId}).save();
        }
        // const foundPipBoys = await  PipBoyStatsModel.find({userId: ctx.from.id});
        // const filterPips=  foundPipBoys.filter(pip => pip.name === userDocument.nickname);
        // console.log(filterPips)
        if (userDocument.nickname && data.name === userDocument.nickname && userDocument.tgId === ctx.message.from.id) {
            await new PipBoyStatsModel({...data, userId: userData.tgId}).save();
        } else {
            await ctx.reply("Ты где его взял? Это точно не твоё, верни на место!")
        }
    } catch (e) {
        ctx.reply("Ты точно делаешь что-то не то, попробуй прислать пип-бой из /me, а не обычный")
    }

}