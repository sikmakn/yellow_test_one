import {Express} from 'express';
import jogController from './jog.controller';
import authController from './auth.controller';

export default function (app: Express) {
    app.use('/auth', authController);
    app.use('/jog', jogController);
}