import express from 'express'
import { verifyToken } from '../middlewares/verifyToken';
import LikeControler from '../controllers/likesController';
const router = express.Router();


router.post('/upvote/post/:id',verifyToken,LikeControler.UpvotePost);
router.post('/downvote/post/:id',verifyToken,LikeControler.DownvotePost);
router.post('/upvote/comment/:id',verifyToken,LikeControler.UpvoteComment);
router.post('/downvote/comment/:id',verifyToken,LikeControler.DownvoteComment);



export default router;