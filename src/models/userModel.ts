import {model, Schema, Document} from "mongoose";



export interface UserDocument extends Document{
    telegram: {},
    pip: {},

}

const UserSchema = new Schema<UserDocument>({
    telegram: {

        firstName: String,
        id: Number,
        userName: String,
    },
    pip: {

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
    }

    // ,history: {
    //     pip: [{
    //         name: String,
    //         health: Number,
    //         strength: Number,
    //         precision: Number,
    //         charisma: Number,
    //         agility: Number,
    //         endurance: Number,
    //         damage: Number,
    //         armor: Number,
    //         timeStamp: Number,
    //         dzen: Number,
    //     }],
    // },
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    },
});


export const UserModel = model('Users', UserSchema);


