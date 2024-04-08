import { Request, Response, NextFunction } from 'express';
import AppError from "../utils/AppError";


const asyncWrapper = (asyncFunc:(req:Request,res:Response,next:NextFunction)=>any)=>{
      return (req:Request,res:Response,next:NextFunction)=>{
         asyncFunc(req,res,next).catch((err:Error)=>{
                const message = err.message;
                const statusCode = 500;
                const error = new AppError().Create(message,statusCode);
                next(error);
         })
      }
}

export default asyncWrapper;