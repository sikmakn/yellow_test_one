import {Document, model, Model, Schema} from 'mongoose';

interface IJog extends Document {
    username: string;
    date: Date;
    distance: number;
    time: number;
}

const JogSchema = new Schema({
    username: {type: String, required: true},
    date: {type: Date, required: true},
    distance: {type: Number, required: true},
    time: {type: Number, required: true},
})

const Jog: Model<IJog> = model('Jog', JogSchema);

export default Jog;