import 'dotenv/config';
import express, {NextFunction, Request, Response} from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerOptions from './swagger.json';
import cors from 'cors';
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import configControllers from './controllers';
import {connect} from 'mongoose';

async function start() {
    await connect(process.env.MONGO_URI as string, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    });

    const app = express();

    app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerOptions));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(cors({
        exposedHeaders: ['Authorization', 'Content-Length'],
        allowedHeaders: ['Authorization', 'Accept', 'Content-Type', 'X-Requested-With', 'Range'],
        credentials: true,
        // origin: process.env.ORIGIN,
    }));
    app.use(cookieParser());
    app.use(compression());
    app.use(helmet());

    configControllers(app);

    app.use('*', (req, res) => {
        res.sendStatus(404);
    });

    app.use((err: ResponseError, req: Request, res: Response, next: NextFunction) => {
        if (err.name == 'ValidationError' || err.name === 'TypeError')
            return res.sendStatus(400);
        res.sendStatus(err.status || 500);
    });
    app.listen(process.env.PORT || 3002);
}

start();