import {Document, model, Model, Schema} from 'mongoose';

interface IFIle extends Document {
    name: string;
    contentType: string
}

const FileSchema = new Schema({
    name: {type: String, required: true},
    contentType: {type: String, required: true},
})

const File: Model<IFIle> = model('File', FileSchema);

export default File;