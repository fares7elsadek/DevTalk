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
const Users_1 = __importDefault(require("../models/Users"));
const mongoose_1 = __importDefault(require("mongoose"));
//list all posts
const ListPosts = (0, asyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (+page - 1) * +limit;
    const posts = yield Posts_1.default.find({}, { '__v': false }).limit(+limit).skip(skip)
        .populate({ path: 'user', select: "id firstname lastname username" });
    res.status(200).json({ status: httpMessage_1.HttpMessage.SUCCESS, data: { posts } });
}));
//list single post
const ListSinglePost = (0, asyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    (0, verifyMongoId_1.default)(id);
    const post = yield Posts_1.default.findOne({ _id: id }, { '__v': false })
        .populate({ path: 'user', select: "id firstname lastname username" });
    res.status(200).json({ status: httpMessage_1.HttpMessage.SUCCESS, data: { post } });
}));
//delete post
const DeletePost = (0, asyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const userId = req.user.id;
    (0, verifyMongoId_1.default)(id);
    const user = yield Users_1.default.findById({ _id: userId });
    if (!user) {
        return next(new AppError_1.default().Create(`not authorized`, 401));
    }
    let PostFound = user.posts.filter(postId => postId.toString() == id);
    if (PostFound.length == 0) {
        return next(new AppError_1.default().Create(`Post not found`, 400));
    }
    const Post = yield Posts_1.default.findByIdAndDelete({ _id: id });
    if (!Post) {
        return next(new AppError_1.default().Create(`not authorized`, 401));
    }
    user.posts = user.posts.filter(postId => postId.toString() != id);
    yield user.save();
    res.status(200).json({ status: httpMessage_1.HttpMessage.SUCCESS, message: "the post has been deleted" });
}));
//create new Post
const CreatePost = (0, asyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        return next(new AppError_1.default().Create(`not authorized`, 401));
    }
    (0, verifyMongoId_1.default)(userId);
    const user = yield Users_1.default.findById({ _id: userId });
    if (!user) {
        return next(new AppError_1.default().Create(`not authorized`, 401));
    }
    const { title, description } = req.body;
    const id = new mongoose_1.default.Types.ObjectId(userId);
    const NewPost = {
        title,
        description,
        user: id,
        postedAt: Date.now()
    };
    const Post = new Posts_1.default(NewPost);
    yield Post.save();
    user.posts.push(Post._id);
    yield user.save();
    res.status(200).json({ status: httpMessage_1.HttpMessage.SUCCESS, Post: NewPost });
}));
exports.default = {
    ListPosts,
    ListSinglePost,
    DeletePost,
    CreatePost
};
