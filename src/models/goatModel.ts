import { model, Schema } from "mongoose";
import { GangModel } from "./gangModel";


const GoatSchema = new Schema({
    name: String,
    leaderId: String,
    gangs: [String]
})


export const GoatModel = model('Goats', GoatSchema)