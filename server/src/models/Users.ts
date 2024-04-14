import mongoose from "mongoose";



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
    tokens:{
        DevTalk_Token:{
           type:String,
           default:""
        },
        verifyToken:{
            type:String,
            default:""
        },
        passwordResetToken:{
            token:{
               type:String,
               default:""
            },
            passwordChangedAt:Date
        }
    },
    verified:{
        type:Boolean,
        default:false
    }
},{
     timestamps:true
});


export default mongoose.model('Users',userSchema);