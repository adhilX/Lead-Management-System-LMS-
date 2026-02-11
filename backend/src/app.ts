import express from "express";      
import dotenv from "dotenv";
import cors from 'cors';
import cookieParser from 'cookie-parser';
dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ 
    origin: process.env.ORIGIN,
    credentials: true 
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
  