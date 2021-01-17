import dotenv from 'dotenv';
import express from 'express';
import saggerUi from 'swagger-ui-express';
import swaggerOptions from './swagger.json';
import cors from 'cors';
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import configControllers from './controllers';

dotenv.config();

const app = express();

app.use('/api', saggerUi.serve, saggerUi.setup(swaggerOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors({
    exposedHeaders: ['Authorization', 'Content-Length'],
    allowedHeaders: ['Authorization', 'Accept', 'Content-Type', 'X-Requested-With', 'Range'],
    credentials: true,
    origin: process.env.ORIGIN,
}));
app.use(cookieParser());
app.use(compression());
app.use(helmet());

configControllers(app);

app.listen(process.env.PORT || 3002);