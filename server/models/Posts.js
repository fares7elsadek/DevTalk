const Sequelize = require('sequelize');
const sequelize = require('../utils/connectdb');

const Posts = sequelize.define('posts',{
    id:{
        type:Sequelize.UUID,
        allowNull:false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4 
    },
    title:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    url:{
        type:Sequelize.STRING,
        allowNull:false
    },
    userid:{
        type:Sequelize.UUID,
        allowNull:false,
        primaryKey: true,
    },
    posteAt:{
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
}); 


module.exports = Posts;