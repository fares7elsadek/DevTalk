"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const PostsSchema = new mongoose.Schema({
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
        type: mongoose.Schema.ObjectId,
        ref: "Users"
    },
    comments: [{ type: mongoose.Schema.ObjectId, ref: "Comments" }],
    likes: [{ type: mongoose.Schema.ObjectId, ref: "Likes" }]
}, { timestamps: true });
exports.default = mongoose.model('Posts', PostsSchema);
