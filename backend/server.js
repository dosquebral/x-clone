import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import connectMongoDB from './db/connectMongoDB.js';

import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT; 

app.use(express.json());  // to parse req.body
app.use(express.urlencoded({ extended: true })); // to parse from data(urlenconded)
app.use(cookieParser()); // to parse cookie

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectMongoDB();
})