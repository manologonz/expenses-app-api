import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import qs from 'qs';
import { notFound, errorHandler, sanitizeQueryParams } from '../utils/middlewares';
import AllRoutes from './routes';

// app instantiation
const app = express();

app.set('query parser', (queryVal: string) => qs.parse(queryVal));

// middlewares
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
}
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/api', sanitizeQueryParams, AllRoutes);

// error handling
app.use(notFound);
app.use(errorHandler);

export default app;
