import express, { response } from 'express'
import expressAsyncHandler from 'express-async-handler'
import Wishlist from '../model/wishListModel.js'
import { isAuth } from '../utils.js'



const wishListRouter = express.Router()

//add to wishlist
wishListRouter.post('/add', isAuth, expressAsyncHandler(async (req, res) => {
    const serviceID = req.body.service
    const user = req.user.id;
    const oldwishlist = await Wishlist.findOne({ where:{user: user, service: serviceID} })
   
    try {
        if (!oldwishlist) {
            const wishlist = new Wishlist({
                user: req.user.id,
                service: req.body.service
            })
            const newWishlist = await wishlist.save();
        
            if (newWishlist) {
                return res.status(201).send({ message: "New WishList Added" })
            }
        }
        return res.status(401).send({ message: "Already in wishlist" })
    } catch (error) {
        return res.status(500).send({ message: error.message })
    }
    
}))
//for particular service
wishListRouter.get('/service', isAuth, expressAsyncHandler(async (req, res) => {
    const user = req.user.id
    const service = req.body.service;
    const wishlist = await Wishlist.findOne({ where:{user: user, service: service} })
    if (wishlist) {
        res.status(200).send(wishlist);
    }
    return res.status(404).send({message:"No wishList for user"})
}))
// for particular user
wishListRouter.get('/user',isAuth, expressAsyncHandler(async (req, res) => {
    const user = req.user.id
    try {
        const wishlist = await Wishlist.findAll({where:{user:user}})
        if (wishlist) {
            return res.status(200).send(wishlist);
        }
        return res.status(404).send({message:"No wishlist Yet"})
    } catch (error) {
        return res.status(500).send({message:'somethings went wrong'});   
    }
}))
// delete wishlist
wishListRouter.delete('/delete/:id',isAuth, expressAsyncHandler(async (req, res) => {
    const user = req.user.id
    const id = req.params.id
    try {
        const wishlist = await Wishlist.findOne({ where: { id:id } })
        if (wishlist) {
            if (wishlist.user === user) {
                await wishlist.destroy()
                return res.status(200).send({message:"Review Deleted Successfully"})
            }
            else {
                return res.status(403).send({message:'You are not Allowed'})
            }
        }
        return res.status(404).send({message:'no wishlist found'})
        
    } catch (error) {
        return res.status(500).send({message:'Somethings went wrong'})
    }
}))


export default wishListRouter;