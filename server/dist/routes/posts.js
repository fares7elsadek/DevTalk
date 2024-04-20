"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const postsController_1 = __importDefault(require("../controllers/postsController"));
const verifyToken_1 = require("../middlewares/verifyToken");
const allowTo_1 = __importDefault(require("../middlewares/allowTo"));
const roles_1 = require("../utils/roles");
const router = express_1.default.Router();
//list all posts
router.get('/list', postsController_1.default.ListPosts);
//list single post
router.get('/list/:id', postsController_1.default.ListSinglePost);
//create new post
router.post('/new', verifyToken_1.verifyToken, postsController_1.default.CreatePost);
//delete post
router.delete('/remove/:id', verifyToken_1.verifyToken, (0, allowTo_1.default)(roles_1.roles.admin, roles_1.roles.user), postsController_1.default.DeletePost);
exports.default = router;
