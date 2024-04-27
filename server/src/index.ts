import express from 'express';
import dotenv from 'dotenv'; 
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { Request, Response, NextFunction } from 'express';
import dbConnect from './config/dbconnect';
import authRoute from './routes/auth';
import commentsRoute from './routes/comments';
import likesRoute from './routes/likes';
import postsRoute from './routes/posts';
import UsersRoute from './routes/user';
import AppError from './utils/AppError';
import { HttpMessage } from './utils/httpMessage';
const path = require('path');
dotenv.config(); 
const app = express();
const PORT = process.env.PORT || 5000;

dbConnect();
app.use(bodyParser.json());
app.use('/uploads',express.static(path.join(__dirname,'uploads')));
app.use(cookieParser());
app.use(morgan('dev'));

// auth route
app.use('/api/auth',authRoute);
// comments route
app.use('/api/comments',commentsRoute);
// likes route
app.use('/api/likes',likesRoute);
// posts route
app.use('/api/posts',postsRoute);
// users route
app.use('/api/user',UsersRoute);


app.all('*',(req,res,next)=>{
    res.status(404).json({message:HttpMessage.NOTFOUND,code:404});
})

app.use((error:AppError,req:Request,res:Response,next:NextFunction)=>{
    res.status(error.statusCode || 500).json({code:error.statusCode,message:error.message,errors:error.errors});
})

app.listen(PORT,()=>{
    console.log(`app lisen on port ${PORT}`);
})