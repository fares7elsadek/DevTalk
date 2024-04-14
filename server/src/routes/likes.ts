import express from 'express'
import { verifyToken } from '../middlewares/verifyToken';
import LikeControler from '../controllers/likesController';
const router = express.Router();


router.post('/new/:id',verifyToken,LikeControler.LikePost);







export default router;