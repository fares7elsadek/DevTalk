const mongoose = require('mongoose');


let userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    username:{
        type:String,
        requried:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    posts:[{type:mongoose.Schema.ObjectId,ref:"Posts"}],
    comments:[{type:mongoose.Schema.ObjectId,ref:"Comments"}],
    likes:[{type:mongoose.Schema.ObjectId,ref:"Likes"}],
    avatar:{
        type:String,
        default:""
    },
    role:{
        type:String,
        default:"User",
        enum:[
            "Admin",
            "User"
        ]
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    passwordChangedAt: Date,
},{
     timestamps:true
});


export default mongoose.model('Users',userSchema);