import verifyId from '../utils/verifyMongoId';
import asyncWrapper from '../middlewares/asyncWrapper';
import { HttpMessage } from '../utils/httpMessage';
import AppError from '../utils/AppError';
import { Request, Response, NextFunction } from 'express';
import PostModel from '../models/Posts'
import UserModel from '../models/Users';
import mongoose, { ObjectId } from 'mongoose';


interface CustomeRequset extends Request{
    user?:{
        id?:string
    }
}

//list all posts
const ListPosts = asyncWrapper(async(req:CustomeRequset,res,next)=>{
    const query = req.query;
    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (+page-1)*+limit;
    const posts = await PostModel.find({},{'__v':false}).limit(+limit).skip(skip)
    .populate({path:'user',select:"id firstname lastname username"});
    res.status(200).json({status:HttpMessage.SUCCESS,data:{posts}});
})

//list single post
const ListSinglePost = asyncWrapper(async(req,res,next)=>{
    const id = req.params.postId;
    verifyId(id);
    const post = await PostModel.findOne({_id:id},{'__v':false})
    .populate({path:'user',select:"id firstname lastname username"});
    res.status(200).json({status:HttpMessage.SUCCESS,data:{post}});
})

//delete post
const DeletePost = asyncWrapper(async(req,res,next)=>{
    const id = req.params.postId;
    verifyId(id);
    const Post = await PostModel.findByIdAndDelete({_id:id});
    if(!Post){
        return next(new AppError().Create(`not authorized`,401));
    }
    const user = await UserModel.findById({_id:Post.user});
    if(!user){
        return next(new AppError().Create(`not authorized`,401));
    }
    user.posts = user.posts.filter(postId => postId.toString() != id);
    await user.save();
    res.status(200).json({status:HttpMessage.SUCCESS,message:"the post has been deleted"});
})


//create new Post
const CreatePost = asyncWrapper(async(req:CustomeRequset,res,next)=>{
    const userId = req.user?.id;
    if(!userId){
        return next(new AppError().Create(`not authorized`,401));
    }
    verifyId(userId)
    const user = await UserModel.findById({_id:userId});
    if(!user){
        return next(new AppError().Create(`not authorized`,401));
    }
    const {title,description} = req.body;
    const id = new mongoose.Types.ObjectId(userId);
    const NewPost={
        title,
        description,
        user:id,
        postedAt:Date.now()
    }
    const Post = new PostModel(NewPost);
    await Post.save();
    user.posts.push(Post._id);
    await user.save();
    res.status(200).json({status:HttpMessage.SUCCESS,Post:NewPost});
})


export default {
    ListPosts,
    ListSinglePost,
    DeletePost,
    CreatePost
}