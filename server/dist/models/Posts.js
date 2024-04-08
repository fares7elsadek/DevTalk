"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PostsSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images: [{ type: String, default: "" }],
    postedAt: Date,
    user: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: "Users"
    },
    comments: [{ type: mongoose_1.default.Schema.ObjectId, ref: "Comments" }],
    likes: [{ type: mongoose_1.default.Schema.ObjectId, ref: "Likes" }]
}, { timestamps: true });
exports.default = mongoose_1.default.model('Posts', PostsSchema);
