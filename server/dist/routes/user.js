"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const UserController_1 = __importDefault(require("../controllers/UserController"));
const verifyToken_1 = require("../middlewares/verifyToken");
const multer_1 = __importDefault(require("../config/multer"));
//upload avatar
router.post('/avatar', verifyToken_1.verifyToken, multer_1.default.single("image"), UserController_1.default.UploadAvatar);
exports.default = router;
