"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verifyToken_1 = require("../middlewares/verifyToken");
const commentsController_1 = __importDefault(require("../controllers/commentsController"));
const allowTo_1 = __importDefault(require("../middlewares/allowTo"));
const roles_1 = require("../utils/roles");
const router = express_1.default.Router();
//get all comments in single post
router.get('/list/:id', commentsController_1.default.ListCommentsOnPost);
//get single comment
router.get('/list/single/:id', commentsController_1.default.ListSingleComment);
//delete comment
router.delete('/remove/:id', verifyToken_1.verifyToken, (0, allowTo_1.default)(roles_1.roles.admin, roles_1.roles.user), commentsController_1.default.DeleteComment);
//create comment
router.post('/new/:id', verifyToken_1.verifyToken, commentsController_1.default.CreateComment);
exports.default = router;
