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
const Posts_1 = __importDefault(require("../models/Posts"));
const Comments_1 = __importDefault(require("../models/Comments"));
const upvote_1 = __importDefault(require("../models/upvote"));
const downvote_1 = __importDefault(require("../models/downvote"));
const likesDao_1 = __importDefault(require("../models/Dao/likesDao"));
const UpvotePost = (0, asyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.id;
    const userId = req.user.id;
    (0, verifyMongoId_1.default)(postId);
    yield likesDao_1.default.LikeHelper(userId, postId, upvote_1.default, Posts_1.default, "post", "Upvote", next, res);
}));
const DownvotePost = (0, asyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.id;
    const userId = req.user.id;
    (0, verifyMongoId_1.default)(postId);
    yield likesDao_1.default.LikeHelper(userId, postId, downvote_1.default, Posts_1.default, "post", "Downvote", next, res);
}));
const UpvoteComment = (0, asyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const commmentId = req.params.id;
    const userId = req.user.id;
    (0, verifyMongoId_1.default)(commmentId);
    yield likesDao_1.default.LikeHelper(userId, commmentId, upvote_1.default, Comments_1.default, "comment", "Upvote", next, res);
}));
const DownvoteComment = (0, asyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = req.params.id;
    const userId = req.user.id;
    (0, verifyMongoId_1.default)(commentId);
    yield likesDao_1.default.LikeHelper(userId, commentId, downvote_1.default, Comments_1.default, "comment", "Downvote", next, res);
}));
exports.default = {
    UpvotePost,
    DownvotePost,
    UpvoteComment,
    DownvoteComment
};
