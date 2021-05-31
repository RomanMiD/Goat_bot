import { model, Schema, Document } from "mongoose";

interface PipBoyStats {
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

}


export interface UserDocument extends Document {
    nickname: PipBoyStatsDocument['name'];
    tgId: string | number;
    username: string;
    role: string

    getPips(): [];

}

export interface PipBoyStatsDocument extends Document {
    gang: string,
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

}

const UserSchema = new Schema<UserDocument>({
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

UserSchema.methods.getPips = function () {
    return PipBoyStatsModel.find().where("userId").in([this.tgId])
}
export const PipBoyStatsModel = model<PipBoyStatsDocument>("pip-boys", PipBoySchema);
export const UserModel = model<UserDocument>("Users", UserSchema);


