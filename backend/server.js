import express from 'express'
import mongoose from 'mongoose'
import otpRouter from './router/otpRouter.js';
import userRouter from './router/userRouter.js';
import dotenv  from 'dotenv'
import categoriesRouter from './router/categoriesRouter.js';

const app = express();

dotenv.config()

app.use(express.json()); ////middleware
app.use(express.urlencoded({ extended :false })); ///middleware

mongoose.connect(process.env.MONGODB_URL ||'mongodb://localhost/wedding', {
    useNewUrlParser: true, //to get ride from duplicate waring
    useUnifiedTopology: true,

}).then(()=> {
    console.log("connection successfull")
}).catch((err)=> console.log(err))



app.get('/', (req, res)=>{
    res.send("welcome from server")
})
app.use('/api/user', userRouter)
app.use('/api/otp', otpRouter)
app.use('/api/category', categoriesRouter)



app.listen(5000,()=>{
    console.log("http://localhost:5000")
})