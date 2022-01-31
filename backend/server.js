import express from 'express'
import mongoose from 'mongoose'
import otpRouter from './router/otpRouter.js';
import userRouter from './router/userRouter.js';
import dotenv  from 'dotenv'
import categoriesRouter from './router/categoriesRouter.js';
import Sequelize from 'sequelize'
import db from './database/postgressdb.js';
import bodyParser from 'body-parser';
import cors from 'cors'
import subcategoriesRouter from './router/subCategories.js';
import cityRouter from './router/cityRouter.js';


const app = express();

dotenv.config()

//request parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost/wedding', {
    useNewUrlParser: true, //to get ride from duplicate waring
    useUnifiedTopology: true,
}).then(()=> {
    console.log("connection successfull")
}).catch((err)=> console.log(err))


db.sequelize.authenticate().then(() => {

    console.log('Connection has been established successfully.');
    
    }).catch(err => {
    
    console.error('Unable to connect to the database:', err);
    
    });


app.get('/', (req, res)=>{
    res.send("welcome from server")
})
app.use('/api/user', userRouter)
app.use('/api/otp', otpRouter)
app.use('/api/category', categoriesRouter)
app.use('/api/subcategory', subcategoriesRouter)
app.use('/api/city', cityRouter)

app.listen(5000,()=>{
    console.log("http://localhost:5000")
})