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
const Posts_1 = __importDefault(require("../models/Posts"));
//list all posts
const ListPosts = (0, asyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const limit = req.limit || 10;
    const page = req.page || 1;
    const skip = (page - 1) * limit;
    const posts = yield Posts_1.default.find({}, { '__v': false }).limit(limit).skip(skip);
    res.status(200).json({ status: httpMessage_1.HttpMessage.SUCCESS, data: { posts } });
}));
//list single post
const ListSinglePost = (0, asyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.postId;
    (0, verifyMongoId_1.default)(id);
    const post = yield Posts_1.default.findOne({ _id: id }, { '__v': false });
    res.status(200).json({ status: httpMessage_1.HttpMessage.SUCCESS, data: { post } });
}));
//delete post
const DeletePost = (0, asyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.postId;
    (0, verifyMongoId_1.default)(id);
    yield Posts_1.default.deleteOne({ _id: id });
    res.status(200).json({ status: httpMessage_1.HttpMessage.SUCCESS, message: "the post has been deleted" });
}));
//create new Post
const CreatePost = (0, asyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
}));
exports.default = {
    ListPosts,
    ListSinglePost,
    DeletePost,
    CreatePost
};
