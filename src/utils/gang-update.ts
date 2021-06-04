import { gangTableParser } from "./gang-table.parser";
import { UserModel } from "../models/userModel";
import { Role } from "../common/role.enum";
import { GangModel } from "../models/gangModel";
import { findRats } from "./gang-help";

export async function gangUpdate(ctx, next) {
    const {membersNicknames, goatName, crewLeader, gang} = gangTableParser(ctx.message.text);
    console.log(gang);
    //если чувак с панельки лидер-- то и чувак с этой модели должен иметь роль лидера
    const leaderDocument = await UserModel.findOne({nickname: crewLeader, gang});
    const gangDocument = await GangModel.findOne({name: gang});
    if (leaderDocument) {
        leaderDocument.role = Role.CrewLeader;
        await leaderDocument.save();
        ctx.reply(`Здравия ${crewLeader}, самому справедливому лидеру ${gang} в составе ${goatName || null}`);
    }


    //если такой банды не нашлось, то попросить скинуть панельку козла, обработать её, сохранить банды, входящие в козёл
    //
    //TODO: Обработка панельки козла
    if (!gangDocument) {
        const gang1 = leaderDocument.gang
        // const goat = await GoatModel.findOne({gangs: gang});
        const banditsDocuments = await UserModel.find({gang: gang1}).where("nickname").in(membersNicknames);
        await new GangModel(
            {
                name: gang1,
                goat: goatName,
                members: membersNicknames
                // members: banditsDocuments.map(bandit => {
                //    return  bandit.nickname;
                // })
            }).save();
        /**
         * Возвращает массив никнеймов бандитов,
         * что не скинули пип-бои в полном формате по типу /me
         * @param gangSquadFromPanel
         *массив никнеймов с панельки банды
         * @param foundedBanditsDoc
         * массив документов найденных записей бандитов в банде
         */
        console.log(findRats(membersNicknames, banditsDocuments));
    }
    next();
}