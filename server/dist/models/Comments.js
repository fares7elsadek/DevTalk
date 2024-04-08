"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const CommentsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "Users"
    },
    post: {
        type: mongoose.Schema.ObjectId,
        ref: "Posts"
    },
    postedAt: Date,
    comment: {
        type: String,
        required: true
    }
}, { timestamps: true });
exports.default = mongoose.model('Comments', CommentsSchema);
