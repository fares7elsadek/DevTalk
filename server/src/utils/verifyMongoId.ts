
import mongoose from "mongoose";
import AppError from "./AppError";

const verifyId=(id:string)=>{
      const valid = mongoose.Types.ObjectId.isValid(id);
      if(!valid){
          throw new Error("invalid");
      }
}