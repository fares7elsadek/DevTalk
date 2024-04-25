import mongoose from "mongoose";



const PostsSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    images:[{type:String,default:""}],
    postedAt:Date,
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"Users"
    },
    comments:[{type:mongoose.Schema.ObjectId,ref:"Comments"}],
    Upvote:[{type:mongoose.Schema.ObjectId,ref:"Upvote"}],
    Downvote:[{type:mongoose.Schema.ObjectId,ref:"Downvote"}]
},{timestamps:true})

export default mongoose.model('Posts',PostsSchema);