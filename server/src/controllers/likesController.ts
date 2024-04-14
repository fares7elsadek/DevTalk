import verifyId from '../utils/verifyMongoId';
import asyncWrapper from '../middlewares/asyncWrapper';
import { HttpMessage } from '../utils/httpMessage';
import AppError from '../utils/AppError';
import { Request } from 'express';
import PostModel from '../models/Posts';
import LikeModel from '../models/Likes';
import mongoose from 'mongoose';
import Likes from '../models/Likes';


interface CustomeRequest extends Request{
    user?:any
}



const LikePost = asyncWrapper(async(req:CustomeRequest,res,next)=>{
    const postId = req.params.id;
    const userId = req.user.id;
    verifyId(postId);
    const alreadyLiked = await LikeModel.findOne({$and:[{user:userId},{post:postId}]});
    if(alreadyLiked!=null){
        console.log("first",alreadyLiked);
        const Lid = alreadyLiked._id;
        const done = await PostModel.findByIdAndUpdate(
            {_id: postId},
            { $pull: { likes: Lid } },
            { new: true }
        );
        if(!done){
            return next(new AppError().Create(`something wrong has happened`,400));
        }
        await LikeModel.deleteOne({_id:Lid});
        res.status(200).json({status:HttpMessage.SUCCESS});
    }else{
        console.log("second",alreadyLiked);
        const Like = new LikeModel({
            user:userId,
            post:postId
        });
        await Like.save();
        const done = await PostModel.findByIdAndUpdate(
            {_id: postId},
            { $push: { likes: Like._id } }, 
            { new: true }
        );
        if(!done){
            return next(new AppError().Create(`something wrong has happened`,400));
        }
        res.status(200).json({status:HttpMessage.SUCCESS});
    }
})

export default {
    LikePost
}