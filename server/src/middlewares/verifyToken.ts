const jwt = require('jsonwebtoken');
import AppError from "../utils/AppError";
import { HttpMessage } from "../utils/httpMessage";
import { Request, Response, NextFunction } from 'express';
import UserModel from '../models/Users'
import dotenv from 'dotenv';
dotenv.config();


interface CustomeRequest extends Request{
    user?:any
}

export const verifyToken = async(req:CustomeRequest,res:Response,next:NextFunction)=>{
    const cookie = req.cookies;
    if(!cookie.DevTalk_token){
        return next(new AppError().Create("token is required",403));
    }
    try{
        const curUser = jwt.verify(cookie.DevTalk_token,process.env.JWT_SECRET);
        if(!curUser){
            return next(new AppError().Create("not authorized",403));
        }
        const user = await UserModel.findById({_id:curUser.id});
        if(!user){
            return next(new AppError().Create("not authorized",403));
        }
        if(!user.tokens || user.tokens.DevTalk_Token || cookie.DevTalk_token!=user.tokens.DevTalk_Token){
            return next(new AppError().Create("not authorized",403));
        }
        req.user = curUser;
        next();
    }catch(err){
        const error = new AppError().Create("not authorized",401);
        return next(error);
    }

}