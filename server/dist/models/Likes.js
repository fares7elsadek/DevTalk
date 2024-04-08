"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const LikesSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "Users"
    },
    post: {
        type: mongoose.Schema.ObjectId,
        ref: "Posts"
    }
}, { timestamps: true });
exports.default = mongoose.model('Likes', LikesSchema);
