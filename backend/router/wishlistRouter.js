import express, { response } from 'express'
import expressAsyncHandler from 'express-async-handler'
import Wishlist from '../model/wishListModel.js'
import { isAuth } from '../utils.js'



const wishListRouter = express.Router()


wishListRouter.post('/add', isAuth, expressAsyncHandler(async (req, res) => {
    const serviceID = req.body.service
    const user = req.user.id;
    const oldwishlist = await Wishlist.find({ userId: user, serviceId: serviceID })
   
    if (oldwishlist.length === 0) {
        const wishlist = new Wishlist({
            userId: req.user.id,
            serviceId: req.body.service
        })
        const newWishlist = await wishlist.save();
    
        if (newWishlist) {
            return res.status(201).send({ message: "New WishList Added" })
        }
    }
    return res.status(401).send({ message: "Already in wishlist" })
    
}))
wishListRouter.get('/user/:id', isAuth, expressAsyncHandler(async (req, res) => {
    const user = req.user.id
    const service = req.params.id;
    const wishlist = await Wishlist.find({ userId: user, serviceId: service })
    if (wishlist) {
        res.status(200).send(wishlist);
    }
}))
wishListRouter.get('/list',isAuth, expressAsyncHandler(async (req, res) => {
    const user = req.user.id
    try {
        const wishlist = await Wishlist.find({userId:user}).populate('serviceId')
        if (wishlist) {
            return res.status(200).send(wishlist);
        }
    } catch (error) {
        return res.status(500).send({message:'somethings went wrong'});   
    }
}))


export default wishListRouter;