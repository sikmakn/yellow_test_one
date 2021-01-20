import express, {NextFunction, Request, Response} from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerOptions from './swagger.json';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import configControllers from './controllers';

const app = express();

app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors({
    exposedHeaders: ['Authorization', 'Content-Length'],
    allowedHeaders: ['Authorization', 'Accept', 'Content-Type', 'X-Requested-With', 'Range'],
    credentials: true,
}));
app.use(cookieParser());
app.use(compression());
app.use(helmet());

configControllers(app);

app.use('*', (req, res) => {
    res.sendStatus(404);
});

app.use((err: ResponseError, req: Request, res: Response, next: NextFunction) => {
    console.log(err);
    if (err.name == 'ValidationError' || err.name === 'TypeError')
        return res.sendStatus(400);
    res.sendStatus(err.status || 500);
});

export default app;