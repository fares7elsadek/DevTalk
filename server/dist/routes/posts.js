"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const postsController_1 = __importDefault(require("../controllers/postsController"));
const router = express_1.default.Router();
//list all posts
router.get('/list', postsController_1.default.ListPosts);
//list single post
router.get('/list/:postId', postsController_1.default.ListSinglePost);
//create new post
router.post('/new', postsController_1.default.CreatePost);
//delete post
router.delete('/remove/:postId', postsController_1.default.DeletePost);
exports.default = router;
