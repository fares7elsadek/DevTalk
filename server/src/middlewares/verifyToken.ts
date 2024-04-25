const jwt = require('jsonwebtoken');
import AppError from "../utils/AppError";
import { HttpMessage } from "../utils/httpMessage";
import { Request, Response, NextFunction } from 'express';
import UserClass from '../models/Dao/UserDao';
import dotenv from 'dotenv';
dotenv.config();


interface CustomeRequest extends Request{
    user?:any
}

export const verifyToken = (req:CustomeRequest,res:Response,next:NextFunction)=>{
    const {DevTalk_token,refresh_token} = req.cookies;
    if(!DevTalk_token){
        return next(new AppError().Create("token is required",403));
    }
    try{
        let curUser = jwt.verify(DevTalk_token,process.env.JWT_SECRET);
        if(!curUser){
            return next(new AppError().Create("not authorized",403));
        }
        req.user = curUser;
        next();
    }catch(err){
        try{
            const User = jwt.verify(refresh_token,process.env.JWT_SECRET);
            if(!User){
                return next(new AppError().Create("not authorized",403));
            }
            const accessToken = new UserClass().generateJwtToken(User.id,User.firstname,User.role,User.isBlocked);
            res.cookie("DevTalk_token",accessToken,{
                httpOnly:true,
                maxAge:48*60*60*1000
            });
            req.user = User;
            next();
        }catch(err){
            const error = new AppError().Create("not authorized",401);
            return next(error);
        }       
    }

}