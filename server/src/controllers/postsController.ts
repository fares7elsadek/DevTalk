import verifyId from '../utils/verifyMongoId';
import asyncWrapper from '../middlewares/asyncWrapper';
import { HttpMessage } from '../utils/httpMessage';
import AppError from '../utils/AppError';
import { Request, Response, NextFunction } from 'express';
import PostModel from '../models/Posts'

interface CustomeRequset extends Request{
    limit?:number,
    page?:number
}

//list all posts
const ListPosts = asyncWrapper(async(req:CustomeRequset,res,next)=>{
    const query= req.query;
    const limit = req.limit ||10;
    const page = req.page || 1;
    const skip = (page-1)*limit;
    const posts = await PostModel.find({},{'__v':false}).limit(limit).skip(skip);
    res.status(200).json({status:HttpMessage.SUCCESS,data:{posts}});
})

//list single post
const ListSinglePost = asyncWrapper(async(req,res,next)=>{
    const id = req.params.postId;
    verifyId(id);
    const post = await PostModel.findOne({_id:id},{'__v':false});
    res.status(200).json({status:HttpMessage.SUCCESS,data:{post}});
})

//delete post
const DeletePost = asyncWrapper(async(req,res,next)=>{
    const id = req.params.postId;
    verifyId(id);
    await PostModel.deleteOne({_id:id});
    res.status(200).json({status:HttpMessage.SUCCESS,message:"the post has been deleted"});
})


//create new Post
const CreatePost = asyncWrapper(async(req,res,next)=>{

})


export default {
    ListPosts,
    ListSinglePost,
    DeletePost,
    CreatePost
}