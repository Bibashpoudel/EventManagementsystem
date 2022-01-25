import express from 'express'
import mongoose from 'mongoose'
import userRouter from './router/userRouter.js';

const app = express();

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



app.listen(5000,()=>{
    console.log("http://localhost:5000")
})