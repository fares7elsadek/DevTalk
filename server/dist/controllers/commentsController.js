"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const verifyMongoId_1 = __importDefault(require("../utils/verifyMongoId"));
const asyncWrapper_1 = __importDefault(require("../middlewares/asyncWrapper"));
const httpMessage_1 = require("../utils/httpMessage");
const AppError_1 = __importDefault(require("../utils/AppError"));
const Posts_1 = __importDefault(require("../models/Posts"));
const Comments_1 = __importDefault(require("../models/Comments"));
const mongoose_1 = __importDefault(require("mongoose"));
//list all Comments on single post
const ListCommentsOnPost = (0, asyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.postId;
    const query = req.query;
    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (+page - 1) * +limit;
    const Comments = yield Posts_1.default.find({ _id: postId }, { comments: true, user: true }).limit(+limit).skip(skip)
        .populate({ path: 'user', select: "id firstname lastname username" })
        .populate({ path: 'comments', select: "comment postedAt" });
    res.status(200).json({ status: httpMessage_1.HttpMessage.SUCCESS, data: { Comments } });
}));
//list single comment
const ListSingleComment = (0, asyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.commentId;
    (0, verifyMongoId_1.default)(id);
    const comment = yield Comments_1.default.findOne({ _id: id }, { comment: true, user: true, postedAt: true })
        .populate({ path: 'user', select: "id firstname lastname username" });
    res.status(200).json({ status: httpMessage_1.HttpMessage.SUCCESS, data: { comment } });
}));
//delete comment
const DeleteComment = (0, asyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.commentId;
    (0, verifyMongoId_1.default)(id);
    const Comment = yield Comments_1.default.findByIdAndDelete({ _id: id });
    if (!Comment) {
        return next(new AppError_1.default().Create(`not authorized`, 401));
    }
    const Post = yield Posts_1.default.findById({ _id: Comment.post });
    if (!Post) {
        return next(new AppError_1.default().Create(`not authorized`, 401));
    }
    Post.comments = Post.comments.filter(CommentId => CommentId.toString() != id);
    yield Post.save();
    res.status(200).json({ status: httpMessage_1.HttpMessage.SUCCESS, message: "the comment has been deleted" });
}));
//create new Comment
const CreateComment = (0, asyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const postId = req.params.postId;
    if (!userId) {
        return next(new AppError_1.default().Create(`not authorized`, 401));
    }
    (0, verifyMongoId_1.default)(userId);
    const { comment } = req.body;
    const Post = yield Posts_1.default.findById({ _id: postId });
    if (!Post) {
        return next(new AppError_1.default().Create(`not authorized`, 401));
    }
    const idUser = new mongoose_1.default.Types.ObjectId(userId);
    const idPost = new mongoose_1.default.Types.ObjectId(postId);
    const NewComment = {
        user: idUser,
        post: idPost,
        comment,
        postedAt: Date.now()
    };
    const Comment = new Comments_1.default(NewComment);
    yield Comment.save();
    Post.comments.push(Comment._id);
    yield Post.save();
    res.status(200).json({ status: httpMessage_1.HttpMessage.SUCCESS, Post: NewComment });
}));
exports.default = {
    ListCommentsOnPost,
    ListSingleComment,
    DeleteComment,
    CreateComment
};
