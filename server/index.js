const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 5000;
const authRoute = require('./routes/auth');
const commentsRoute = require('./routes/comments');
const likesRoute = require('./routes/likes');
const postsRoute = require('./routes/posts');
const sequelize = require('./utils/connectdb');
sequelize.sync().then(()=>{
    console.log('mysql connected');
}).catch((error)=> console.log(error));





//auth route
app.use('/auth',authRoute);
//comments route
app.use('/comments',commentsRoute);
//likes route
app.use('/likes',likesRoute);
//posts route
app.use('/posts',postsRoute);




app.listen(PORT,()=>{
    console.log(`app lisen on port ${PORT}`);
})