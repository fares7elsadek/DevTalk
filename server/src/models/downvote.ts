import mongoose from "mongoose";


const DownVoteSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"Users"
    },
    post:{
        type:mongoose.Schema.ObjectId,
        ref:"Posts"
    },
    comment:{
        type:mongoose.Schema.ObjectId,
        ref:"Comments"
    }
},{timestamps:true})


export default mongoose.model('Downvote',DownVoteSchema);