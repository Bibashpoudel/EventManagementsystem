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

// const whitelist = ["http://localhost:3000"]

// const corsOptions = {

//   origin: function (origin, callback) {

//     if (!origin || whitelist.indexOf(origin) !== -1) {

//       callback(null, true)

//     } else {

//       callback(new Error("Not allowed by CORS"))

//     }

//   },

//   credentials: true,

// }
// app.use(cors(corsOptions))

app.get('/', (req, res)=>{
    res.send("welcome from server")
})
app.use('/api/user', userRouter)
app.use('/api/otp', otpRouter)
app.use('/api/category', categoriesRouter)



app.listen(5000,()=>{
    console.log("http://localhost:5000")
})