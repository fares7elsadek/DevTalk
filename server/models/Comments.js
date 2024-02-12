const Sequelize = require('sequelize');
const sequelize = require('../utils/connectdb');

const Comments = sequelize.define('comments',{
    id:{
        type:Sequelize.STRING,
        allowNull:false,
        primaryKey: true,
    },
    postId:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    comment:{
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


module.exports = Comments;