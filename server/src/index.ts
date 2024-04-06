import express from 'express';
import dotenv from 'dotenv'; 
dotenv.config(); 
import authRoute from './routes/auth';
import commentsRoute from './routes/comments';
import likesRoute from './routes/likes';
import postsRoute from './routes/posts';
const app = express();
const PORT = process.env.PORT || 5000;




// auth route
app.use('/auth',authRoute);
// comments route
app.use('/comments',commentsRoute);
// likes route
app.use('/likes',likesRoute);
// posts route
app.use('/posts',postsRoute);




app.listen(PORT,()=>{
    console.log(`app lisen on port ${PORT}`);
})