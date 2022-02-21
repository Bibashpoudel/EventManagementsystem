
import Sequelize from "sequelize";
const sequelize = new Sequelize('postgres://postgres:root@localhost:5432/wedding')



const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;



export default db;
