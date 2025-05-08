import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import authRoutes from './routes/auth.route.js';
import { connectDB } from './config/db.config.js';
import cookieParser from "cookie-parser"
import router from './routes/message.route.js';
import { app , server } from './config/socket.js';
import path from 'path';

//it is used to load environment variables from a .env file into process.env
dotenv.config();
const __dirname = path.resolve();
//it is used to allow cross-origin requests from the client-side application to the server-side application
app.use(cors( {origin: 'http://localhost:5173' ,
  credentials : true, // Allow credentials (cookies, authorization headers, etc.)
})
); // Allow all origins
// built in middleware used to parse incoming requests with JSON payloads and convert them to JavaScript objects
app.use(express.json()); 
//THE COOKIE-PARSER MIDDLEWARE IS USED TO PARSE COOKIES FROM THE REQUEST HEADERS AND MAKE THEM AVAILABLE IN req.cookies
app.use(cookieParser());
const PORT = process.env.PORT || 3000;
app.get('/',(req,res)=>
{
  res.send("Hello there")
})
app.use('/api/auth', authRoutes);
app.use('/api/messages', router);

if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, '../client/dist', 'index.html');
    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error('Error sending index.html:', err);
        res.status(500).send('Internal Server Error');
      }
    });
  });
  
}


server.listen(PORT,()=>
{
   console.log(`Server is listening at ${PORT}`)
})
connectDB();