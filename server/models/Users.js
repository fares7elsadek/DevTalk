const Sequelize = require('sequelize');
const sequelize = require('../utils/connectdb');

const Users = sequelize.define('users',{
    id:{
        type:Sequelize.UUID,
        allowNull:false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4 
    },
    firstname:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    lastname:{
        type:Sequelize.STRING,
        allowNull:false
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false,
        unique: true,
        validate:{
            isEmail: true
        }
    },
    username:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true
    },
    password:{
        type:sequelize.STRING,
        allowNull:false
    }
}); 


module.exports = Users;