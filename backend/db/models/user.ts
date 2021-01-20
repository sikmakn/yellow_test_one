import {Document, model, Model, Schema} from 'mongoose';

interface IUser extends Document {
    username: string;
    password: string;
    salt: string;
}

const UserSchema = new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    salt: {type: String, required: true},
}, {
    toObject: {versionKey: false},
    toJSON: {versionKey: false},
});

const User: Model<IUser> = model('User', UserSchema);

export default User;