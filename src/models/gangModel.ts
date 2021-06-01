import { model, Schema, Document } from "mongoose";
import { UserDocument, UserModel, UserSchema } from "./userModel";

interface GangDocument extends Document{
    goat: string;
    name: string;
    members: UserDocument[];
    getMembers(): UserDocument[];
    updateMembers():void;
}

const GangSchema = new Schema<GangDocument>({
    goat: String,
    name: String,
    members: [String]
});

GangSchema.methods.getMembers = function(){
    UserModel.find().where("userId").in([this.members])
}

GangSchema.methods.updateMembers = function(membersNicknames: string[]){
    const membersDocuments = UserModel.find().where('nickname').in(membersNicknames);
    console.log(membersDocuments)
}

export const GangModel = model<GangDocument>('gangs', GangSchema)

