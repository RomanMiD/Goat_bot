import { goatTableParser } from "./gang-table.parser";
import { GoatModel } from "../models/goatModel";
import { UserModel } from "../models/userModel";

export async function goatManager(ctx, next) {
    const {goatName, goatLeaderName, gangs} = goatTableParser(ctx.message.text);
    const GoatDocument = await GoatModel.findOne({goatName, goatLeaderName});
    // Если такого документа нет- создать его
    if (!GoatDocument) {
        const goatLeaderDocument = await UserModel.findOne({nickname: goatLeaderName});
        // const gangsDocuments = await GangModel.find({goat: goatName})
        await new GoatModel({name: goatName, leaderId: goatLeaderDocument.tgId, gangs}).save();
        return;
    }else{}
    next();
}