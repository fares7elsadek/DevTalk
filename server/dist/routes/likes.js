"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verifyToken_1 = require("../middlewares/verifyToken");
const likesController_1 = __importDefault(require("../controllers/likesController"));
const router = express_1.default.Router();
router.post('/new/:id', verifyToken_1.verifyToken, likesController_1.default.LikePost);
exports.default = router;
