import mongoose from "mongoose";
const CommentsSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"Users"
    },
    post:{
        type:mongoose.Schema.ObjectId,
        ref:"Posts"
    },
    postedAt:Date,
    comment:{
        type:String,
        required:true
    },
    Upvote:[{type:mongoose.Schema.ObjectId,ref:"Upvote"}],
    Downvote:[{type:mongoose.Schema.ObjectId,ref:"Downvote"}]
},{timestamps:true});

export default mongoose.model('Comments',CommentsSchema);