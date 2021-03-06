import {regexps} from "../regexps/pipBoy-regexp";
import { PipBoyStatsModel, UserModel } from "../models/userModel";


export const parseClassic = (text) => {
    const [, charisma] = regexps.classicCharismaRegExp.exec(text);
    const [, agility] = regexps.classicAgilityRegExp.exec(text);
    const [, name] = regexps.classicNameRegExp.exec(text);
    const [, damage] = regexps.classicDamageRegExp.exec(text);
    const [, armor] = regexps.classicArmorRegExp.exec(text);
    const [, strength] = regexps.classicStrengthRegExp.exec(text);
    const [, precision] = regexps.classicPrecisionRegExp.exec(text);
    const [, endurance] = regexps.classicEnduranceRegExp.exec(text);
    // const [, hunger] = regexps.classicHungerRegExp.exec(text);
    const [, health] = regexps.classicHealthRegExp.exec(text);
    // const [, faction] = regexps.classicFactionRegExp.exec(text);
    // const [, version] = regexps.classicVerisonRegExp.exec(text);
    const [, gang] = regexps.classicGangRegExp.exec(text)||'';


    let dzens;
    let dzensAmount = 1;
    let dzen: number = 0;

    if (regexps.dzenRegExp.test(text)) {
        //@ts-ignore
        [, dzens, dzensAmount] = regexps.dzenRegExp.exec(text);
    }

    if (/(\d+)/.test(dzens) && !regexps.dzenBarsRegExp.test(text)) {
        //@ts-ignore
        [, dzen] = /(\d+)/.exec(dzens);
        dzen = Number(dzen);
    } else {
        if (dzensAmount || regexps.dzenBarsRegExp.test(text)) {
            dzen = Number(dzensAmount - 1);
        }

        if (dzens && !dzensAmount) {
            dzen = dzens.length / 2;
        }
    }


    const data = {
        // version,
        // faction,
        health,
        name,
        damage,
        armor,
        // hunger,
        strength,
        precision,
        charisma,
        agility,
        endurance,
        dzen,
        gang
    };

    Object.keys(data).forEach((key) => {
        if (!Number.isNaN(Number(data[key]))) {
            data[key] = Number(data[key]);
        }
    });

    return data;
};

export const parseSimple = (text) => {
    const [, charisma] = regexps.simpleCharismaRegExp.exec(text);
    const [, agility] = regexps.simpleAgilityRegExp.exec(text);
    const [, strength] = regexps.simpleStrengthRegExp.exec(text);
    const [, endurance] = regexps.simpleEnduranceRegExp.exec(text);
    const [, precision] = regexps.simplePrecisionRegExp.exec(text);
    // const [, hunger] = regexps.simpleHungerRegExp.exec(text);
    const [, health] = regexps.simpleHealthRegExp.exec(text);
    const [, armor] = regexps.simpleArmorRegExp.exec(text);
    const [, name] = regexps.simpleNameRegExp.exec(text);
    // const [, faction] = regexps.simpleFactionRegExp.exec(text);
    const [, damage] = regexps.simpleDamageRegExp.exec(text);
    const [, gang] = regexps.simpleGangRegExp.exec(text);
    let dzens;
    let dzenAmount;
    let dzen = 0;

    if (regexps.dzenRegExp.test(text)) {
        [, dzens, dzenAmount] = regexps.dzenRegExp.exec(text);
    }

    if (dzenAmount) {
        dzen = Number(dzenAmount);
    } else if (dzens) {
        dzen = dzens.length / 2;
    }

    const data = {
        name: name.replace(/\w+$/, '').replace(/[\????]/g,  ''),
        gang,
        armor,
        // faction,
        health,
        // hunger,
        strength,
        precision,
        charisma,
        agility,
        endurance,
        damage,
        version: 0,
        dzen,
    };

    Object.keys(data).forEach((key) => {
        if (!Number.isNaN(Number(data[key]))) {
            data[key] = Number(data[key]);
        }
    });

    return data;
};

export const parsePip = ({text, forward_date: forwardDate}, isClassic) => {
    if (isClassic) {
        return {...parseClassic(text), date: forwardDate};
    }

    return {...parseSimple(text), date: forwardDate};
};



