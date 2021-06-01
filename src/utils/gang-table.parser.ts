import {
    crewLeadRegExp,
    gangRegExp,
    goatGangNameRegExp,
    goatNameInTablesRegExp,
    goatNameRegExp,
    membersRegExp
} from "../regexps/gang-panel.regexp";


export const gangTableParser = (text:string) => {
    const table = text;
    const gang = gangRegExp.exec(text)[1];
    const goatName = goatNameRegExp.exec(text)[1];
    const crewLeader = crewLeadRegExp.exec(text)[1];
    let membersNicknames: string[] =[];

    // @ts-ignore
    table.replace(membersRegExp, function(a, b){membersNicknames.push(b)});
    return {goatName, gang, crewLeader, membersNicknames};
}

export const goatTableParser = (text:string) => {
    const goatTable = text;
    const goatName = goatNameInTablesRegExp.exec(text)[1];
    let gangs = [];
    const goatLeaderName = crewLeadRegExp.exec(text)[1];
    // @ts-ignore
    goatTable.replace(goatGangNameRegExp, function(a,b){gangs.push(b)});

    return {goatName, goatLeaderName, gangs};
}