import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import authRoutes from './routes/auth.route.js';
import { connectDB } from './config/db.config.js';
import cookieParser from "cookie-parser"
import router from './routes/message.route.js';
import { app , server } from './config/socket.js';

dotenv.config();

app.use(cors( {origin: 'http://localhost:5173' ,
  credentials : true, // Allow credentials (cookies, authorization headers, etc.)
})
); // Allow all origins
app.use(express.json()); 
app.use(cookieParser());
const PORT = process.env.PORT || 3000;
app.get('/',(req,res)=>
{
  res.send("Hello there")
})
app.use('/api/auth', authRoutes)
app.use('/api/messages', router)

server.listen(PORT,()=>
{
   console.log(`Server is listening at ${PORT}`)
})
connectDB();