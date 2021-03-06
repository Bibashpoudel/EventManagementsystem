import Sequelize from 'sequelize'
import db from '../database/postgressdb.js';
import User from './userModel.js';


const Wishlist = db.sequelize.define('Wishlist', {
    id: {
        // Sequelize module has INTEGER Data_Type.
        type: Sequelize.INTEGER,
        // To increment user_id automatically.
        autoIncrement: true,
        // user_id can not be null.
        allowNull: false,
        // For uniquely identify user.
        primaryKey: true
    },
    service: {
        type: Sequelize.STRING,
        allowNull:false
    },
    user: {
        type: Sequelize.INTEGER,
        references: {
            // This is a reference to another model
            model: User,
            // This is the column name of the referenced model
            key: 'id'
        }
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
    
})
Wishlist.sync()

export default Wishlist;