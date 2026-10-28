import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { redis } from './config/redis.js';
import { errorHandler } from './middleware/errorHandler.js';

import propertyRoutes from './routes/propertyRoutes.js';
import receiptRoutes from './routes/receiptRoutes.js';
import tenancyRoutes from './routes/tenancyRoutes.js'; 


const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.use(helmet());
app.use(cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use(express.json());
app.use(morgan('dev'));

//ping redis to check redis is up or not
app.get('/health' , async (req, res) => {
    let redisStatus = 'disabled';
    if(redis){
        try{
            const ping = await redis.ping();
            redisStatus = ping === 'PONG' ? 'healthy' : ping;
        }
        catch(err){
            redisStatus = 'unreachable';
        }
    }

    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        services: {
            api: 'running',
            redis: redisStatus,
        },
    });
});

app.use('/api/properties', propertyRoutes);
app.use('/api/receipts', receiptRoutes);
app.use('/api/tenancies', tenancyRoutes);

app.use(errorHandler);

app.listen(PORT , () => {
    console.log(`🚀 Rentify Backend running at http://localhost:${PORT}`);
});