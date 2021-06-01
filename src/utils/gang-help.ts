import { UserDocument } from "../models/userModel";

export function findRats(gangSquadFromPanel:string[], foundedBanditsDoc: UserDocument[]): string[]{
    const  bandits = foundedBanditsDoc.map(bandit=> bandit.nickname);
    let rats = gangSquadFromPanel.filter((member,i)=>{
        return bandits.indexOf(member)==-1})
    return rats
}