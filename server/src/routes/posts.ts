import express from 'express'
import PostControler from '../controllers/postsController';
import { verifyToken } from '../middlewares/verifyToken';
import allowTo from '../middlewares/allowTo'
import { roles } from '../utils/roles';
const router = express.Router();


//list all posts
router.get('/list',PostControler.ListPosts)

//list single post
router.get('/list/:postId',PostControler.ListSinglePost)

//create new post
router.post('/new',verifyToken,PostControler.CreatePost)

//delete post
router.delete('/remove/:postId',verifyToken,allowTo("post",roles.admin,roles.user),PostControler.DeletePost)










export default router;