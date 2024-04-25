"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UpVoteSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: "Users"
    },
    post: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: "Posts"
    },
    comment: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: "Comments"
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model('Upvote', UpVoteSchema);
