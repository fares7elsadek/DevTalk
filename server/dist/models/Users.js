"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
let userSchema = new mongoose_1.default.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        requried: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    posts: [{ type: mongoose_1.default.Schema.ObjectId, ref: "Posts" }],
    comments: [{ type: mongoose_1.default.Schema.ObjectId, ref: "Comments" }],
    likes: [{ type: mongoose_1.default.Schema.ObjectId, ref: "Likes" }],
    avatar: {
        type: String,
        default: ""
    },
    role: {
        type: String,
        default: "User",
        enum: [
            "Admin",
            "User"
        ]
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    tokens: {
        DevTalk_Token: {
            type: String,
            default: ""
        },
        verifyToken: {
            type: String,
            default: ""
        },
        passwordResetToken: {
            token: {
                type: String,
                default: ""
            },
            passwordChangedAt: Date
        }
    },
    verified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model('Users', userSchema);
