import express from 'express';


import expressAsyncHandler from 'express-async-handler';
import otpGenerator from 'otp-generator'
import OTP from '../model/OTPmodel.js';
import User from '../model/userModel.js';
import  { message, subject_mail } from '../templates/email/email_verification.js';
import nodemailer from 'nodemailer'
const otpRouter = express.Router();
import { otpGen } from 'otp-gen-agent'
import {encode, decode} from '../middleware/endcoder.js'

function AddMinutesToDate(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
}

var dates = {
    convert:function(d) {
        // Converts the date in d to a date-object. The input can be:
        //   a date object: returned without modification
        //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
        //   a number     : Interpreted as number of milliseconds
        //                  since 1 Jan 1970 (a timestamp) 
        //   a string     : Any format supported by the javascript engine, like
        //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
        //  an object     : Interpreted as an object with year, month and date
        //                  attributes.  **NOTE** month is 0-11.
        return (
            d.constructor === Date ? d :
            d.constructor === Array ? new Date(d[0],d[1],d[2]) :
            d.constructor === Number ? new Date(d) :
            d.constructor === String ? new Date(d) :
            typeof d === "object" ? new Date(d.year,d.month,d.date) :
            NaN
        );
    },
    compare:function(a,b) {
        // Compare two dates (could be of any type supported by the convert
        // function above) and returns:
        //  -1 : if a < b
        //   0 : if a = b
        //   1 : if a > b
        // NaN : if a or b is an illegal date
        return (
            isFinite(a=this.convert(a).valueOf()) &&
            isFinite(b=this.convert(b).valueOf()) ?
            (a>b)-(a<b) :
            NaN
        );
    },
    inRange:function(d,start,end) {
        // Checks if date in d is between dates in start and end.
        // Returns a boolean or NaN:
        //    true  : if d is between start and end (inclusive)
        //    false : if d is before start or after end
        //    NaN   : if one or more of the dates is illegal.
       return (
            isFinite(d=this.convert(d).valueOf()) &&
            isFinite(start=this.convert(start).valueOf()) &&
            isFinite(end=this.convert(end).valueOf()) ?
            start <= d && d <= end :
            NaN
        );
    }
}








otpRouter.post('/emailotp', expressAsyncHandler(async (req, res) => {

    
    try {
        const user = await User.findOne({ email: req.body.email });
        const isExist = await OTP.findOne({ email: req.body.email });
        const email = req.body.email;
        const type = req.body.type
        let email_subject, email_message;
        if (user) {
            const response = { "Status": "failure", "Details": "Email already exist" }
            return res.status(400).send(response)
        }
        if (!email) {
            const response = { "Status": "failure", "Details": "Email not Provided" }
            return res.status(400).send(response)
        }
        if (!type) {
            const response = { "Status": "Failure", "Details": "Type not provided" }
            return res.status(400).send(response)
        }
        //const otp = otpGenerator.generate(6, {digits:true, upperCaseAlphabets: false, specialChars: false ,alphabets:false });
        const otp = await otpGen();        
        const now = new Date();
        const expiration_time = AddMinutesToDate(now, 10);
        console.log(otp)
        const otp_data = new OTP({
            code: otp,
            expire_time: expiration_time,
            verification: false,
           
            
        })
       
        
            console.log("bibash")
            const details={
                "timestamp": now, 
                "check": email,
                "success": true,
                "message":"OTP sent to user",
                "otp_id": otp_data.id
              }
          
              // Encrypt the details object
            
            const encoded= await encode(JSON.stringify(details))
           
        if (type) {
            if (type == "VERIFICATION") {
               
                email_message = message(otp)
                email_subject = subject_mail
            }
            // else if (type == "FORGET") {
            //    import  message, subject_mail } from '../templates/email/email_forget';
            //     email_message = message(otp)
            //     email_subject = subject_mail
            // }
            // else if (type == "2FA") {
            //     const { message, subject_mail } = '../templates/email/email_2FA';
            //     email_message = message(otp)
            //     email_subject = subject_mail
            // }
            // else {
            //     const response = { "Status": "Failure", "Details": "Incorrect Type Provided" }
            //     return res.status(400).send(response)
            // }
        }
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
      
      
        const mailOptions = {
            from: `"Techfortress"<pdlbibash77@gmail.com>`,
            to: `${email}`,
            subject: email_subject,
            text: email_message,
        };
      
        await transporter.verify();
          
        //Send Email
        await transporter.sendMail(mailOptions, (error, response) => {
            if (error) {
                return res.status(400).send({ "Status": "messege send Fail", "Details": error });
            } else {
                return res.send({ "Status": "Success", "Details": encoded });
            }

        })
    

    } catch (error) {
        const response={"Status":"server error","Details": error}
        return res.status(400).send(response)
    }
}))
otpRouter.put('/verify', expressAsyncHandler(async (req, res) => {
    try{
    var currentdate = new Date(); 
    const {verification_key, otp, check} = req.body;

    if(!verification_key){
      const response={"Status":"Failure","Details":"Verification Key not provided"}
      return res.status(400).send(response) 
    }
    if(!otp){
      const response={"Status":"Failure","Details":"OTP not Provided"}
      return res.status(400).send(response) 
    }
    if(!check){
      const response={"Status":"Failure","Details":"Check not Provided"}
      return res.status(400).send(response) 
    }

    let decoded;

    //Check if verification key is altered or not and store it in variable decoded after decryption
    try{
      decoded = await decode(verification_key)
    }
    catch(err) {
      const response={"Status":"Failure", "Details":"Bad Request"}
      return res.status(400).send(response)
    }

    var obj= JSON.parse(decoded)
    const check_obj = obj.check

    // Check if the OTP was meant for the same email or phone number for which it is being verified 
    if(check_obj!=check){
      const response={"Status":"Failure", "Details": "OTP was not sent to this particular email or phone number"}
      return res.status(400).send(response) 
    }

    const otp_schema= await OTP.findOne({where:{id: obj.otp_id}})

    //Check if OTP is available in the DB
    if(otp_schema!=null){
      //Check if OTP is already used or not
      if(otp_schema.verification!=true){

          //Check if OTP is expired or not
          if (dates.compare(otp_schema.expiration_time, currentdate)==1){

              //Check if OTP is equal to the OTP in the DB
              if(otp===otp_schema.otp){
                  // Mark OTP as verified or used
                  otp_schema.verification=true
                  otp_schema.save()

                  const response={"Status":"Success", "Details":"OTP Matched", "Check": check}
                  return res.status(200).send(response)
              }
              else{
                  const response={"Status":"Failure","Details":"OTP NOT Matched"}
                  return res.status(400).send(response) 
              }   
          }
          else{
              const response={"Status":"Failure","Details":"OTP Expired"}
              return res.status(400).send(response) 
          }
      }
      else{
          const response={"Status":"Failure","Details":"OTP Already Used"}
          return res.status(400).send(response)
          }
      }
    else{
        const response={"Status":"Failure","Details":"Bad Request"}
        return res.status(400).send(response)
    }
  }catch(err){
      const response={"Status":"Failure","Details": err.message}
      return res.status(400).send(response)
  }

 

}))

export default otpRouter;