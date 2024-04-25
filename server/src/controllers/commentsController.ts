import verifyId from '../utils/verifyMongoId';
import asyncWrapper from '../middlewares/asyncWrapper';
import { HttpMessage } from '../utils/httpMessage';
import AppError from '../utils/AppError';
import { Request } from 'express';
import PostModel from '../models/Posts';
import CommentModel from '../models/Comments'
import mongoose from 'mongoose';


interface CustomeRequset extends Request{
    user?:any
}

//list all Comments on single post
const ListCommentsOnPost = asyncWrapper(async(req:CustomeRequset,res,next)=>{
    const postId = req.params.id;
    const query = req.query;
    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (+page-1)*+limit;
    const Comments = await CommentModel.find({post:postId},{user:true,post:true,postedAt:true,comment:true}).limit(+limit).skip(skip)
    .populate({path:"post",select:"title description Upvote Downvote"}).sort({Upvote:-1}).exec();
    if(!Comments){
        return next(new AppError().Create(`there's a problem`,400));
    }
   
    res.status(200).json({status:HttpMessage.SUCCESS,data:{Comments}});
})

//list single comment
const ListSingleComment = asyncWrapper(async(req,res,next)=>{
    const id = req.params.id;
    verifyId(id);
    const comment = await CommentModel.findOne({_id:id},{comment:true,user:true,postedAt:true})
    .populate({path:'user',select:"id firstname lastname username"})
    .populate({path:'Upvote',select:"user"})
    .populate({path:'Downvote',select:"user"});
    res.status(200).json({status:HttpMessage.SUCCESS,data:{comment}});
})

//delete comment
const DeleteComment = asyncWrapper(async(req:CustomeRequset,res,next)=>{
    const id = req.params.id;
    const userId = req.user.id;
    verifyId(id);
    const Comment = await CommentModel.findById({_id:id});
    if(!Comment){
        return next(new AppError().Create(`not authorized`,401));
    }
    if(userId!=Comment.user){
        return next(new AppError().Create(`Comment not found`,400));
    }
    const Post = await PostModel.findById({_id:Comment.post});
    if(!Post){
        return next(new AppError().Create(`not authorized`,401));
    }
    Post.comments = Post.comments.filter(CommentId => CommentId.toString() != id);
    await Post.save();
    const CommentDelete = await CommentModel.findByIdAndDelete({_id:id});
    if(!CommentDelete){
        return next(new AppError().Create(`not authorized`,401));
    }
    res.status(200).json({status:HttpMessage.SUCCESS,message:"the comment has been deleted"});
})


//create new Comment
const CreateComment = asyncWrapper(async(req:CustomeRequset,res,next)=>{
    const userId = req.user?.id;
    const postId = req.params.id;
    if(!userId){
        return next(new AppError().Create(`not authorized`,401));
    }
    verifyId(userId)
    const {comment} = req.body;
    const Post = await PostModel.findById({_id:postId});
    if(!Post){
        return next(new AppError().Create(`not authorized`,401));
    }
    const idUser = new mongoose.Types.ObjectId(userId);
    const idPost = new mongoose.Types.ObjectId(postId);
    const NewComment={
        user:idUser,
        post:idPost,
        comment,
        postedAt:Date.now()
    }
    const Comment = new CommentModel(NewComment);
    await Comment.save();
    Post.comments.push(Comment._id);
    await Post.save();
    res.status(200).json({status:HttpMessage.SUCCESS,Post:NewComment});
})


export default {
    ListCommentsOnPost,
    ListSingleComment,
    DeleteComment,
    CreateComment
}