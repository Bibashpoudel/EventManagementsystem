import express from 'express';
import passport from 'passport';
import { generateToken } from '../utils.js';


const auth = express.Router();

auth.get('/login/success', (req, res) => {
    if (req.user) {
        res.status(200).send({
            success: true,
            message: 'Success',
            user: req.user,
            token:generateToken(req.user)
        })
    }
})
auth.get('/login/failure', (req, res) => {
    if (req.user) {
        res.status(200).send({
            success: true,
            message: 'Failure',
            
        })
    }
})


auth.get("/google", passport.authenticate("google", { scope: ["profile"] }));
auth.get('/google/callback', passport.authenticate("google", {
    successRedirect: "http://localhost:3000",
    failureRedirect:"/login/failure"
}))

export default auth;