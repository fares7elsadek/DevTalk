import express from 'express'
import PostControler from '../controllers/postsController';
const router = express.Router();


//list all posts
router.get('/list',PostControler.ListPosts)

//list single post
router.get('/list/:postId',PostControler.ListSinglePost)

//create new post
router.post('/new',PostControler.CreatePost)

//delete post
router.delete('/remove/:postId',PostControler.DeletePost)










export default router;