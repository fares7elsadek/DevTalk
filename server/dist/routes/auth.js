"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const validationSchema_1 = require("../middlewares/validationSchema");
const authController_1 = __importDefault(require("../controllers/authController"));
//register
router.post('/register', (0, validationSchema_1.UsersRigister)(), authController_1.default.registerUser);
//login
router.post('/login', (0, validationSchema_1.UsersLogin)(), authController_1.default.loginUser);
//reset password
router.post('/reset-password', (0, validationSchema_1.ResetPassword)(), authController_1.default.ResetPasswordToken);
//reset password
router.post('/reset-password/:token', (0, validationSchema_1.ResetPassword2)(), authController_1.default.resetPassword);
//logout
router.get('/logout', authController_1.default.Logout_GET);
//verify Email
router.put('/email_confirmation/:token', authController_1.default.verifyEmail);
exports.default = router;
