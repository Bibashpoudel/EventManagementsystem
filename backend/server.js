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
import serviceRouter from './router/serviceRouter.js';
import wishListRouter from './router/wishlistRouter.js';
import reviewRouter from './router/ReviewRouter.js';
import path from 'path';
import uploadRouter from './router/uploadRouter.js';
import serviceDetailsRouter from './router/serviceDetailsRouter.js';
import serviceImageRouter from './router/serviceImageRouter.js';
import passport from 'passport';
import auth from './router/auth.js';
import cookieSession from 'cookie-session'
import './passport.js'


const app = express();

dotenv.config()

//request parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
    cookieSession({ name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 100 })
  );

app.use(passport.initialize());
app.use(passport.session());

// for storing file
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

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
db.sequelize.sync({}).then(() => {
    console.log("sync success")
})

app.get('/', (req, res)=>{
    res.send("welcome from server")
})

app.use('/auth', auth)
app.use('/api/uploads', uploadRouter);
app.use('/api/user', userRouter)
app.use('/api/otp', otpRouter)
app.use('/api/category', categoriesRouter)
app.use('/api/subcategory', subcategoriesRouter)
app.use('/api/city', cityRouter)
app.use('/api/service', serviceRouter)
app.use('/api/details', serviceDetailsRouter)
app.use('/api/images', serviceImageRouter)
app.use('/api/review', reviewRouter)
app.use('/api/wishlist', wishListRouter)

app.listen(5000,()=>{
    console.log("http://localhost:5000")
})