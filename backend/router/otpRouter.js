import express from 'express';


import expressAsyncHandler from 'express-async-handler';



otpRouter.post('/emailotp', expressAsyncHandler(async (req, res) => {


    try {
        const { email, phone } = req.body;
        let email_subject, email_message;
        if (!email) {
            const response={"Status":"failure","Details":"Email not Provided"}
        }
    } catch (error) {
        
    }
}))