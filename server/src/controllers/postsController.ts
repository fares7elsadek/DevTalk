import verifyId from '../utils/verifyMongoId';
import asyncWrapper from '../middlewares/asyncWrapper';
import { HttpMessage } from '../utils/httpMessage';
import AppError from '../utils/AppError';
import { Request } from 'express';
import PostModel from '../models/Posts'
import UserModel from '../models/Users';
import cloudinary from '../config/cloudinary';
import mongoose from 'mongoose';
import DeleteFile from '../utils/deleteFile';



interface CustomeRequset extends Request{
    user?:any,
    files?:any
}

//list all posts
const ListPosts = asyncWrapper(async(req:CustomeRequset,res,next)=>{
    const query = req.query;
    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (+page-1)*+limit;
    const posts = await PostModel.find({},{'__v':false}).limit(+limit).skip(skip)
    .populate({path:'user',select:"id firstname lastname username"})
    .populate({path:'Upvote',select:"user"})
    .populate({path:'Downvote',select:"user"})
    .sort({Upvote:-1}).exec();
    res.status(200).json({status:HttpMessage.SUCCESS,data:{posts}});
})

//list single post
const ListSinglePost = asyncWrapper(async(req,res,next)=>{
    const id = req.params.id;
    verifyId(id);
    const post = await PostModel.findOne({_id:id},{'__v':false})
    .populate({path:'user',select:"id firstname lastname username"})
    .populate({path:'Upvote',select:"user"})
    .populate({path:'Downvote',select:"user"});
    res.status(200).json({status:HttpMessage.SUCCESS,data:{post}});
})

//delete post
const DeletePost = asyncWrapper(async(req:CustomeRequset,res,next)=>{
    const id = req.params.id;
    const userId = req.user.id;
    verifyId(id);
    const user = await UserModel.findById({_id:userId});
    if(!user){
        return next(new AppError().Create(`not authorized`,401));
    }
    let PostFound = user.posts.filter(postId => postId.toString() == id);
    if(PostFound.length==0){
        return next(new AppError().Create(`Post not found`,400));
    }
    const Post = await PostModel.findByIdAndDelete({_id:id});
    if(!Post){
        return next(new AppError().Create(`not authorized`,401));
    }
    user.posts = user.posts.filter(postId => postId.toString() != id);
    await user.save();
    res.status(200).json({status:HttpMessage.SUCCESS,message:"the post has been deleted"});
})


//create new Post
const CreatePost = asyncWrapper(async(req:CustomeRequset,res,next)=>{
    console.log("hello")
    const userId = req.user?.id;
    if(!userId){
        return next(new AppError().Create(`not authorized`,401));
    }
    verifyId(userId);
    const user = await UserModel.findById({_id:userId});
    if(!user){
        return next(new AppError().Create(`not authorized`,401));
    }
    const {title,description} = req.body;
    let uploadedImages = [];
    const images = req.files;
    if(images){
        try{
            for(const file of images){
                const result = await cloudinary.uploader.upload(file.path);
                uploadedImages.push(result.secure_url);
                DeleteFile(file.path);
            }
        }catch(err){
            return next(new AppError().Create(`somthing wrong has happend`,401));
        }
    }
    const id = new mongoose.Types.ObjectId(userId);
    const NewPost={
        title,
        description,
        user:id,
        images:uploadedImages,
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