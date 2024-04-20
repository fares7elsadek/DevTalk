import express from 'express'
import PostControler from '../controllers/postsController';
import { verifyToken } from '../middlewares/verifyToken';
import allowTo from '../middlewares/allowTo'
import { roles } from '../utils/roles';
const router = express.Router();


//list all posts
router.get('/list',PostControler.ListPosts)

//list single post
router.get('/list/:id',PostControler.ListSinglePost)

//create new post
router.post('/new',verifyToken,PostControler.CreatePost)

//delete post
router.delete('/remove/:id',verifyToken,allowTo(roles.admin,roles.user),PostControler.DeletePost)










export default router;