import {Document, model, Model, Schema} from 'mongoose';

interface IFIle extends Document {
    name: string;
}

const JogSchema = new Schema({
    name: {type: String, required: true},
})

const File: Model<IFIle> = model('File', JogSchema);

export default File;