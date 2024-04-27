import express from 'express'
const router = express.Router();
import UserController from '../controllers/UserController';
import { verifyToken } from '../middlewares/verifyToken';
import upload from '../config/multer';



//upload avatar
router.post('/avatar',verifyToken,upload.single("image"),UserController.UploadAvatar);



export default router;