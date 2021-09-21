import mongoose, { Schema } from 'mongoose';

export interface IUser {
    _id?: string;
    name?: string;
    surname: string;
    birthDate: Date;
    email: string;
    gender?: string;
}

const userSchema = new Schema({
    name: { type: String, required: false },
    surname: { type: String, required: true },
    birthDate: { type: Date, required: true },
    email: { type: String, required: true },
    gender: { type: String, required: false }
})

export const UserModel = mongoose.model<IUser & mongoose.Document>('User', userSchema);
export const buildUser = (data: IUser) => {
    return new UserModel(data);
}