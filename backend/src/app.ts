import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/database';
import authRoutes from './routes/auth.routes';
import leadRoutes from './routes/lead.routes';

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.ORIGIN || 'http://localhost:5173', // Default Vite port
    credentials: true
}));

// Routes
app.use('/auth', authRoutes);
app.use('/leads', leadRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
