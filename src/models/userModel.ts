import { model, Schema, Document } from "mongoose";
import { GoatModel } from "./goatModel";

interface PipBoyStats {


}


export interface UserDocument extends Document {
    nickname: PipBoyStatsDocument["name"];
    tgId: string | number;
    username: string;
    role: string
    gang?: string

    getPips(): [];

    getMe(): UserDocument;

    getGoat();

}

export interface PipBoyStatsDocument extends Document {
    userId: string | number,
    gang?: string,
    squad: string,
    name: string,
    health: number,
    strength: number,
    precision: number,
    charisma: number,
    agility: number,
    endurance: number,
    damage: number,
    armor: number,
    timeStamp: number,
    dzen: number,
    getDate();
}

export const UserSchema = new Schema<UserDocument>({
        tgId: {
            required: true,
            type: Number
        },
        username: String,
        gang: String,
        role: String,
        nickname: String,
    },
    {
        timestamps: {
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        },
    });

const PipBoySchema = new Schema<PipBoyStatsDocument>({
        userId: String,
        gang: String,
        squad: String,
        name: String,
        health: Number,
        strength: Number,
        precision: Number,
        charisma: Number,
        agility: Number,
        endurance: Number,
        damage: Number,
        armor: Number,
        timeStamp: Number,
        dzen: Number,

    },
    {
        timestamps: {
            createdAt: "createdAt"
        }
    });

/**
 * Метод выдает qt последних пип-боев игрока, что от отправил
 * @param qt - количество необходимых пип-боев
 *
 */
PipBoySchema.methods.getPips = async function (qt=1) {
    const pipBoyDocuments = await PipBoyStatsModel
        .find()
        .where("userId")
        .in([this.userId])
        .sort('-createdAt')
        .limit(qt);
    return pipBoyDocuments;
}


PipBoySchema.methods.getDate = function(){
    //@ts-ignore
    return this.createdAt
}


UserSchema.methods.getGoat = function () {


}
UserSchema.methods.getMe = async function () {

    return {
        goat: (await GoatModel.findOne({gangs: this.gang})).name || "Я не знаю из какого ты козла",
        gang: this.gang || "Я не знаю из какой ты банды",
        nickname: this.nickname,

    }
};

export const PipBoyStatsModel = model<PipBoyStatsDocument>("pip-boys", PipBoySchema);
export const UserModel = model<UserDocument>("Users", UserSchema);


