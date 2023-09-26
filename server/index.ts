import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { postsRouter } from './routes/posts.router';
import { tableRouter } from './routes/tableData.router';
import { errorHandler } from './middleware/error.middleware';
import { notFoundHandler } from './middleware/not-found.middleware';
import connectDB from './common/database';

//App Variables
if (!process.env.PORT) {
    console.error('PORT variable is null or undefined');
    process.exit(1);
}

connectDB();

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

// Middleware - App Configuration
app.use(express.json());
app.use(helmet());
app.use(
    cors({
        origin: 'http://localhost:3000',
        allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept',
    }),
);
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use('/posts', postsRouter);
app.use('/table-data', tableRouter);

//Error Handlers

app.use(errorHandler);
app.use(notFoundHandler);

//Server Activation

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
