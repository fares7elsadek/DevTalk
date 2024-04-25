"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verifyToken_1 = require("../middlewares/verifyToken");
const likesController_1 = __importDefault(require("../controllers/likesController"));
const router = express_1.default.Router();
router.post('/upvote/post/:id', verifyToken_1.verifyToken, likesController_1.default.UpvotePost);
router.post('/downvote/post/:id', verifyToken_1.verifyToken, likesController_1.default.DownvotePost);
router.post('/upvote/comment/:id', verifyToken_1.verifyToken, likesController_1.default.UpvoteComment);
router.post('/downvote/comment/:id', verifyToken_1.verifyToken, likesController_1.default.DownvoteComment);
exports.default = router;
