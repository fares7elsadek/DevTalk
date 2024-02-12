const Sequelize = require('sequelize');
const sequelize = require('../utils/connectdb');

const Likes = sequelize.define('likes',{
    userid:{
        type:Sequelize.UUID,
        allowNull:false,
        primaryKey: true,
    },
    postId:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    
}); 


module.exports = Likes;