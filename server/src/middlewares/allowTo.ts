import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';
import CommentModel from '../models/Comments'
import PostModel from '../models/Posts'

interface CustomeRequest extends Request{
    user?:any
}

const allowTo = (type:string,...roles:string[])=>{
    return (req:CustomeRequest,res:Response,next:NextFunction)=>{
        if(!roles.includes(req.user.role)){
            return next(new AppError().Create(`allowed only for ${roles}`,401));
        }
        if(req.user.role=="User"){
            if(type=="comment"){
                const id = req.params.id;
                const userId = CommentModel.findById({_id:id},{user:true});
                if(userId==req.user.id){
                    next();
                }else{
                    return next(new AppError().Create(`not authorized`,401));
                }
            }

            if(type=="post"){
                const id = req.params.id;
                const userId = PostModel.findById({_id:id},{user:true});
                if(userId==req.user.id){
                    next();
                }else{
                    return next(new AppError().Create(`not authorized`,401));
                }
            }

        }
        next();
    }
}

export default allowTo;