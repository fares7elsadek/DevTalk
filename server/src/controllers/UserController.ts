import asyncWrapper from "../middlewares/asyncWrapper";
import { Request } from "express";
import cloudinary from "../config/cloudinary";
import AppError from "../utils/AppError";
import Users from "../models/Users";
import { HttpMessage } from "../utils/httpMessage";
import DeleteFile from "../utils/deleteFile";


interface CustomeRequset extends Request{
    user?:any,
    file?:any
}


const UploadAvatar = asyncWrapper(async(req:CustomeRequset,res,next)=>{
    const userId = req.user.id;
    const avatar = req.file;
    if(!avatar){
        return next(new AppError().Create(`somthing wrong has happend`,400));
    }
    try{
        const result = await cloudinary.uploader.upload(avatar.path);
        const user = await Users.findByIdAndUpdate({_id:userId},{$set:{avatar:result.secure_url}});
        if(!user){
            console.log("here")
            return next(new AppError().Create(`somthing wrong has happend`,400));
        }
        DeleteFile(avatar.path);
        res.status(200).json({status:HttpMessage.SUCCESS,message:"uploaded"});
    }catch(err){
        return next(new AppError().Create(`somthing wrong has happend`,400));
    }
})


export default {
    UploadAvatar
}