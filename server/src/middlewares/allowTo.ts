import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';
import CommentModel from '../models/Comments'
import PostModel from '../models/Posts'

interface CustomeRequest extends Request{
    user?:any
}

const allowTo = (...roles:string[])=>{
    return (req:CustomeRequest,res:Response,next:NextFunction)=>{
        if(!roles.includes(req.user.role)){
            return next(new AppError().Create(`allowed only for ${roles}`,401));
        }
        next();
    }
}

export default allowTo;