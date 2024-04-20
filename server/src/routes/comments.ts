import express from 'express'
import { verifyToken } from '../middlewares/verifyToken';
import CommentControler from '../controllers/commentsController';
import allowTo from '../middlewares/allowTo'
import { roles } from '../utils/roles';
const router = express.Router();


//get all comments in single post
router.get('/list/:id',CommentControler.ListCommentsOnPost);

//get single comment
router.get('/list/single/:id',CommentControler.ListSingleComment);

//delete comment
router.delete('/remove/:id',verifyToken,allowTo(roles.admin,roles.user),CommentControler.DeleteComment);

//create comment
router.post('/new/:id',verifyToken,CommentControler.CreateComment);







export default router;