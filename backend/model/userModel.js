import Sequelize from 'sequelize'
import db from '../database/postgressdb.js';


const User = db.sequelize.define('user', {
    id:{
        // Sequelize module has INTEGER Data_Type.
        type:Sequelize.INTEGER,
        // To increment user_id automatically.
        autoIncrement:true,
        // user_id can not be null.
        allowNull:false,
        // For uniquely identify user.
        primaryKey:true
    },
    fullname:{
        type:Sequelize.STRING,
        allowNull: false
    },
    phone: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email:{
        type:Sequelize.STRING,
        allowNull: false
    },
    password:{
        type:Sequelize.STRING,
        allowNull: false
    },
    isAdmin:{
        type:Sequelize.BOOLEAN,
        default:false,
        allowNull: true
    },
    isVendor: {
        type: Sequelize.BOOLEAN,
        default: false,
        allowNull: true
    },
    isCustomer: {
        type: Sequelize.BOOLEAN,
        default: false,
        allowNull: true
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
    
})

User.sync()

export default User;