import {Express} from 'express';
import jogController from './jog.controller';
import authController from './auth.controller';
import fileController from './file.controller';
import authValidateMiddleware from '../helpers/authValidateMiddleware';

export default function (app: Express) {
    app.use('/auth', authController);
    app.use('/jog', authValidateMiddleware, jogController);
    app.use('/file', authValidateMiddleware, fileController);
}