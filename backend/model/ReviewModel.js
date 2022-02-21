import Sequelize from 'sequelize'
import db from '../database/postgressdb.js';
import User from './userModel.js';


const Review = db.sequelize.define('Review', {
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
        allowNull: false
    },
    user_id: {
        type: Sequelize.INTEGER,
        references: {
            // This is a reference to another model
            model: User,
            // This is the column name of the referenced model
            key: 'id'
        }
    },
    rating: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    comment: {
        type: Sequelize.STRING,
        allowNull: true
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
    
});
Review.belongsTo(User,{ onDelete: 'cascade', foreignKey: 'user_id'})
User.hasMany(Review, { foreignKey: 'user_id', as: 'Users'})
export default Review;