import UserModel from '../models/Users';
import { ExpressValidator, body,validationResult} from 'express-validator';
import AppError from '../utils/AppError';
const jwt = require('jsonwebtoken');
import asyncWrapper from '../middlewares/asyncWrapper';
import UserClass from '../models/Dao/UserDao';
import { HttpMessage } from '../utils/httpMessage';
import bcrypt from 'bcryptjs';



//register
const registerUser = asyncWrapper(async(req,res,next)=>{
    const {firstname,lastname,email,title,username,password,confirmedPassword} = req.body;
    const error = validationResult(req);
    if(!error.isEmpty()){
        const message = error.array();
        const statusCode = 400;
        const result:string[] = message.map(obj => obj.msg);
        const err = new AppError().Create("FAIL",statusCode,result);
        return next(err);
    }
    const user = await UserModel.findOne({email:email});
    if(user){
        const err = new AppError().Create("email is already exist",400);
        return next(err);
    }
    const userna = await UserModel.findOne({username});
    if(userna){
        const err = new AppError().Create("username already exist",400);
        return next(err);
    }
    const object = new UserClass();
    const PsswordToken = object.generatePasswordToken(firstname,lastname,email,title);
    await object.CreateNewUser(firstname,lastname,password,email,username,title,PsswordToken);
    const emailOptions = {
        email,
        subject:"confirm email for DevTalk",
        url:`${req.protocol}://${req.get('host')}/api/auth/email_confirmation/${PsswordToken}`
    }
    object.sendPasswordEmail(emailOptions);
    res.status(200).json({status:HttpMessage.SUCCESS,message:`email has been sent successfuly for ${email}`});
});


const loginUser = asyncWrapper(async (req,res,next)=>{
        const {email,password} = req.body;
        const err = validationResult(req);
        if(!err.isEmpty()){
            const message = err.array();
            const statusCode = 400;
            const result = message.map(obj => obj.msg);
            const error = new AppError().Create("FAIL",statusCode,result);
            return next(error);
        }
        const user = await UserModel.findOne({email});
        if(!user){
            return next(new AppError().Create("invalid email or password",400));
        }
        const result = await bcrypt.compare(String(password),user.password);
        if(!result){
            return next(new AppError().Create("invalid email or password",400));
        }
        if(!user.verified){
            return next(new AppError().Create("email has not been verified yet",400));
        }
        const accessToken = new UserClass().generateJwtToken(user._id.toString(),user.firstname,user.role,user.isBlocked);
        const done = await UserModel.findByIdAndUpdate({_id:user._id},{$set:{
            'tokens.DevTalk_Token':accessToken
        }});
        if(!done){
            return next(new AppError().Create("invalid email or password",400));
        }
        res.cookie("DevTalk_token",accessToken,{
            httpOnly:true,
            maxAge:48*60*60*1000
        });
        const data ={
            id:user._id,
            firstname:user.firstname,
            lastname:user.lastname,
            role:user.role,
            title:user.title,
            DevTalk_token:accessToken
        }
        res.status(200).json({status:HttpMessage.SUCCESS,user:{data}});
});


const verifyEmail = asyncWrapper(async(req,res,next)=>{
       const token = req.params.token;
       if(!token){
          return next(new AppError().Create('invalid request',403));
       }
       const verify = jwt.verify(token,process.env.JWT_SECRET);
       if(!verify){
           return next(new AppError().Create('invalid or expired token',403));
       }
       const user = verify;
       const userData = await UserModel.findOne({email:user.email});
       if(!userData || (userData.tokens && userData.tokens.verifyToken && token!=userData.tokens.verifyToken)){
          console.log("hello");
          return next(new AppError().Create('invalid or expired token',403));
       }
       const accessToken = new UserClass().generateJwtToken(userData._id.toString(),userData.firstname,userData.role,userData.isBlocked);
       const done = await UserModel.findOneAndUpdate({email:user.email},{$set:{verified:true,'tokens.verifyToken':"",'tokens.DevTalk_Token':accessToken}});
       if(!done){
           return next(new AppError().Create('invalid or expired token',403));
       }
        res.cookie("DevTalk_token",accessToken,{
          httpOnly:true,
          maxAge:48*60*60*1000
        });
       const data={
            firstname:user.firstname,
            lastname:user.lastname,
            email:user.email,
            title:user.title,
            username:user.username,
            token:accessToken
        }
       res.status(200).json({status:HttpMessage.SUCCESS,user:{message:"the email has been verified",data}});
})


const ResetPasswordToken = asyncWrapper(async(req,res,next)=>{
    const email = req.body.email;
    const err = validationResult(req);
    if(!err.isEmpty()){
        const message = err.array();
        const statusCode = 400;
        const result = message.map(obj => obj.msg);
        const error = new AppError().Create("FAIL",statusCode,result);
        return next(error);
    }
    const user = await UserModel.findOne({email});
    if(!user){
        return next(new AppError().Create(`email has been sent successfuly for ${email}`,200));
    }
    const object = new UserClass();
    const passwordToken = object.generatePasswordToken(user.firstname,user.lastname,user.email,user.title);
    const done = await UserModel.findByIdAndUpdate({_id:user._id},{$set:{'tokens.passwordResetToken.passwordResetToken':passwordToken}});
    if(!done){
        return next(new AppError().Create(`something wrong has happened`,200));
    }
    const emailOptions = {
        email,
        subject:"reset password link for DevTalk",
        url:`${req.protocol}://${req.get('host')}/api/auth/reset-password/${passwordToken}`
    }
    object.sendPasswordEmail(emailOptions);
    res.status(200).json({status:HttpMessage.SUCCESS,message:`email has been sent successfuly for ${email}`});
})

const resetPassword = asyncWrapper(async(req,res,next)=>{
    const token = req.params.token;
    const err = validationResult(req);
    if(!err.isEmpty()){
        const message = err.array();
        const statusCode = 400;
        const result = message.map(obj => obj.msg);
        const error = new AppError().Create("FAIL",statusCode,result);
        return next(error);
    }
    if(!token){
       return next(new AppError().Create('invalid request',403));
    }
    const verify = jwt.verify(token,process.env.JWT_SECRET);
    if(!verify){
        return next(new AppError().Create('invalid or expired token',403));
    }
    const user = verify;
    const userData = await UserModel.findOne({email:user.email});
    if(!userData || (userData.tokens && userData.tokens.passwordResetToken&&token!=userData.tokens.passwordResetToken.token)){
       return next(new AppError().Create('invalid or expired token',403));
    }
    const {password,confirmPassword} = req.body;
    if(password!=confirmPassword){
        return next(new AppError().Create('password did not match',400));
    }
    const done = await UserModel.findOneAndUpdate({email:user.email},{$set:{'tokens.passwordResetToken.token':"",'tokens.passwordResetToken.passwordChangedAt':Date.now()}});
    if(!done){
        return next(new AppError().Create('invalid or expired token',403));
    }
    const hashedPassword = await bcrypt.hash(String(password),10);
    const userPassword = UserModel.findByIdAndUpdate({email:user.email},{$set:{password:hashedPassword}});
    if(!userPassword){
        return next(new AppError().Create('something wrong has happened',400));
    }
    res.status(200).json({status:HttpMessage.SUCCESS,message:`password has been changed successfully`});
})


const Logout_GET = asyncWrapper(async(req,res,next)=>{
    const {DevTalk_token} = req.cookies;
    if(!DevTalk_token){
        return next(new AppError().Create('logout',200));
    }
    const user = jwt.verify(DevTalk_token,process.env.JWT_SECRET);
    if(!user){
        res.cookie('DevTalk_token','',{maxAge:1});
        return next(new AppError().Create('logout',200));
    }
    const done = await UserModel.findByIdAndUpdate({_id:user.id},{
        $set:{
            'tokens.DevTalk_Token':""
        }
    });
    if(!done){
        console.log("hello");
        res.cookie('DevTalk_token','',{maxAge:1});
        return next(new AppError().Create('logout',200));
    }
    res.cookie('DevTalk_token','',{maxAge:1});
    res.status(200).json({status:HttpMessage.SUCCESS,message:`logout`});
})


const authControler ={
    registerUser,
    loginUser,
    verifyEmail,
    ResetPasswordToken,
    resetPassword,
    Logout_GET
}


export default authControler;











