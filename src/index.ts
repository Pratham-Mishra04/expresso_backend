import * as express from 'express';
import { Express, Request, Response, NextFunction } from 'express';
import * as morgan from 'morgan';
import * as path from 'path';
import helmet from 'helmet';
import * as ExpressMongoSanitize from 'express-mongo-sanitize';
import * as cors from 'cors';
import AppError from './managers/AppError';
import noURL from './controllers/errorController';
import userRouter from './routers/userRouter';
import connectToDB from './managers/DB';
import envHandler from './managers/envHandler';
import consumerRouter from './routers/consumerRouter';
import shipperRouter from './routers/shipperRouter';
import messagingRouter from './routers/messagingRouter';
import connectToSocket from './utils/connectToSocket';

const app: Express = express();

app.use(express.json());

app.use(cors());

app.use(helmet());
app.use(ExpressMongoSanitize());

app.use(express.static(path.join(__dirname, 'public')));

if (envHandler('NODE_ENV') === 'dev') app.use(morgan('dev'));

connectToDB();

const server = app.listen(envHandler('PORT'), () => {
    console.log(`Server is running on http://127.0.0.1:${process.env.PORT}`);
});

connectToSocket(server)

app.use((req: Request, res: Response, next: NextFunction) => {
    req.requestedAt = new Date().toISOString();
    next();
});

app.use('/', express.Router({strict:true}).get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, '/utils/documentation.html'))
}) )

app.use('/users', userRouter);
app.use('/consumer', consumerRouter);
app.use('/shipper', shipperRouter);
app.use('/messaging', messagingRouter);


app.all('*', (req: Request, res: Response, next: NextFunction) => {
    next(new AppError(`Cannot find ${req.originalUrl}`, 404));
});

app.use(noURL);

export default app;
