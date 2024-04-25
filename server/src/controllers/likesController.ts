import verifyId from '../utils/verifyMongoId';
import asyncWrapper from '../middlewares/asyncWrapper';
import { HttpMessage } from '../utils/httpMessage';
import AppError from '../utils/AppError';
import PostModel from '../models/Posts';
import CommentModel from '../models/Comments';
import { Request, Response, NextFunction } from 'express';
import UpvoteModel from '../models/upvote';
import DownvoteModel from '../models/downvote';
import LikeDao from '../models/Dao/likesDao';

interface CustomeRequest extends Request{
    user?:any
}




const UpvotePost = asyncWrapper(async(req:CustomeRequest,res,next)=>{
    const postId = req.params.id;
    const userId = req.user.id;
    verifyId(postId);
    await LikeDao.LikeHelper(userId,postId,UpvoteModel,PostModel,"post","Upvote",next,res);
});



const DownvotePost = asyncWrapper(async(req:CustomeRequest,res,next)=>{
    const postId = req.params.id;
    const userId = req.user.id;
    verifyId(postId);
    await LikeDao.LikeHelper(userId,postId,DownvoteModel,PostModel,"post","Downvote",next,res);
});


const UpvoteComment = asyncWrapper(async(req:CustomeRequest,res,next)=>{
    const commmentId = req.params.id;
    const userId = req.user.id;
    verifyId(commmentId);
    await LikeDao.LikeHelper(userId,commmentId,UpvoteModel,CommentModel,"comment","Upvote",next,res);
});

const DownvoteComment = asyncWrapper(async(req:CustomeRequest,res,next)=>{
    const commentId = req.params.id;
    const userId = req.user.id;
    verifyId(commentId);
    await LikeDao.LikeHelper(userId,commentId,DownvoteModel,CommentModel,"comment","Downvote",next,res);
});

export default {
    UpvotePost,
    DownvotePost,
    UpvoteComment,
    DownvoteComment
}