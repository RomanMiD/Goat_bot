import { model, Schema, Document } from "mongoose";
export interface GoatDocument extends Document{
    name: string;
    leaderId: string;
    gangs: string[]
}

const GoatSchema = new Schema({
    name: String,
    leaderId: String,
    gangs: [String]
})


export const GoatModel = model<GoatDocument>('Goats', GoatSchema)