import mongoose from "mongoose";


const LikesSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"Users"
    },
    post:{
        type:mongoose.Schema.ObjectId,
        ref:"Posts"
    }
},{timestamps:true})


export default mongoose.model('Likes',LikesSchema);