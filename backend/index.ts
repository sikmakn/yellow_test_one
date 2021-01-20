import 'dotenv/config';
import {connect} from 'mongoose';
import app from './app';

async function start() {
    await connect(process.env.MONGO_URI as string, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    });
    app.listen(process.env.PORT || 3002);
}

start();