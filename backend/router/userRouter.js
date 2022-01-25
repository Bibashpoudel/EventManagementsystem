import express from 'express';


import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs'
import { generateToken } from '../utils.js';
import User from '../model/userModel.js';
import nodemailer from 'nodemailer'
import axios from 'axios'


const userRouter = express.Router();

userRouter.post('/register', expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    const userphone = await User.findOne({ phone: req.body.phone });

    let length = 6;
        const codegen = ("0".repeat(length) + Math.floor(Math.random() * 10 ** length)).slice(-length);
        console.log(codegen)
    if (!user) {
        let data = JSON.stringify({
            "email": user,
            "code": codegen
          });
        const config = {
            method: 'post',
            url: 'localhost:5000/api/otp/send',
            headers: { 
              'Content-Type': 'application/json'
            },
            data : data
          };
          
          axios(config)
          .then(function (response) {
            console.log(JSON.stringify(response.data));
          })
          .catch(function (error) {
            console.log(error);
          });
        
        if (!userphone) {
            const bcryptpassword = bcrypt.hashSync(req.body.password, 8)
            const user = new User({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                phone: req.body.phone,
                isAdmin: req.body.isAdmin,
                isVendor: req.body.isVendor,
                isCustomer: req.body.isCustomer,
                password: bcryptpassword,
            })

           
            const adduser = await user.save();
            if (adduser) {  
                const output = `
                    <p>You have a new contact request</p>
                    <h3>Your Details Details</h3>
                    <ul>  
                    <li>First Name: ${adduser.firstname}</li>
                    <li>Last Name: ${adduser.lastname}</li>
                    <li>Email: ${adduser.email}</li>
                    <li>Phone: ${adduser.phone}</li>
                    </ul>
                    
                `;
                const transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port:587,
                    secure: false, // true for 465, false for other ports
                    auth: {
                        user: 'pdlbibash77@gmail.com ', // generated ethereal user
                        pass: 'Bibash7$$&&@@'  // generated ethereal password
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                });

                // setup email data with unicode symbols
                let mailOptions = {
                    from: '"TechFortress" contact@techfortress.com', // sender address
                    to: adduser.email, // list of receivers
                    subject: 'Welcome Message', // Subject line
                    text: "Dear " + adduser.firstname + ', \n \n Thank You for Registration. \n Successfully Register', // plain text body
                    html :output
                };

                // send mail with defined transport object
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);
                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

                    res.render('contact', { msg: 'Email has been sent' });
                });
                return res.status(201).send({ message: "Your Account has been Created" })

                    
            }
           else{
                return res.status(500).send({ message: error })
                
            }
        }
        else {
            return res.status(400).send({message:'user already exist with this phone number'})
        }
        
    }
    else{
        return res.status(400).send({message:'user already exist with this email'})
    }
}));




//signin function
userRouter.post('/signin', expressAsyncHandler(async (req, res) => {
    const text = req.body.text;
    const user = await User.findOne({ email: req.body.email });
    const userphone = await User.findOne({phone:req.body.phone});
       
    if(user || userphone){
        if(bcrypt.compareSync(req.body.password, user.password)){
            res.send({
                _id:user._id,
                firstname: user.firstname,
                lastname:user.lastname,
                email: user.email,
                phone: user.phone,
                isAdmin:user.isAdmin,
                isVendor:user.isVendor,
                isCustomer:user.isCustomer,
                token:generateToken(user)
            });
            return ;
        }
        else{
            res.status(401).send({message:"invalid password"})
        }
            
        } else {
            return res.status(400).send({message:'Invalid Email or Phone'})
        }
    }));


export default userRouter;