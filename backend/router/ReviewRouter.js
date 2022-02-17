
import express from 'express'
import expressAsyncHandler from 'express-async-handler';
import Review from '../model/ReviewModel.js';
import Service from '../model/serviceModel.js';
import User from '../model/userModel.js';
import { isAdmin, isAuth } from '../utils.js';


const reviewRouter = express.Router();

// for all review
reviewRouter.get('/',  expressAsyncHandler(async (req, res) => {
    const review = await Review.findAll()

    if (review) {
        return res.status(200).send(review)
    }
    else {
        return res.status(200).send({message:"No Review Found"})
    }
}))

//for particular user
reviewRouter.get('/user',isAuth, expressAsyncHandler(async (req, res) => {
    const user = req.user.id;
    const review = await Review.findAll({ where: { user: user } })
    if (review) {
        return res.status(200).send(review)
    }
    return res.status(200).send({message:"No Review Found"})
}))

//for particular service 
reviewRouter.get('/service', expressAsyncHandler(async (req, res) => {
    const serviceId = req.query.service;
   
    const review = await Review.findAll({
        where: { service: serviceId },
        include: [{
            model: User,
            attributes:['fullname','email']
        }]
    })
    if (review) {
        return res.status(200).send(review)
    }
    return res.status(200).send({message:"No Review Yet"})
}))

reviewRouter.post('/add', isAuth, expressAsyncHandler(async (req, res) => {
    const user = req.user.id;
    const serviceId = req.body.service;
    const review = await Review.findOne({ where: { user: user, service: serviceId } })
    const count = await Review.count({where:{service: serviceId}})
    const service = await Service.findById(serviceId);
   
    if (review) {
        return res.status(401).send({message:"You have already added Review and Comment "})
    }
    else {
        const newReview = new Review({
            user: user,
            comment: req.body.comment,
            service:serviceId,
            rating:req.body.rating
        })
      
        const newNumReviews = count + 1;
        const oldnumberReview = service.numReviews;
        service.numReviews = newNumReviews;
        service.rating = ((service.rating*oldnumberReview) + parseInt(req.body.rating)) / newNumReviews;
        const updateService = await service.save()
        if (updateService) {
            const reviews = await newReview.save()
            if (reviews){
                return res.status(201).send({message:"Review has been Added"})
            }
        }
        return res.status(500).send({message:'Somethings went Wrong'})
    }
}))

reviewRouter.put('/:id', isAuth, expressAsyncHandler(async (req, res) => {
    const user = req.user.id
    const review = await Review.findOne({ where: { service: req.params.id } })
    const getRatting = parseInt(req.body.rating);
    // const count = await Review.count({where:{service: serviceId}})
  
    if (review.user === user) {
          
        
        const service = await Service.findById(review.service);
        console.log(review.rating, service.rating, getRatting)
        const rat = Number((service.rating - review.rating + getRatting) / service.numReviews);
        console.log(rat)
        if (rat >= 0) {
            service.rating = rat
        } else {
            service.rating = 0;
        }
        const updateService = await service.save()
        review.rating = req.body.rating,
        review.comment = req.body.comment
       
        if (updateService) {
            const updateReview =await review.save();
            if (updateReview) {
                return res.status(202).send({message:"Review updated Successfully"})  
            }
           
        }
        return res.status(400).send({message:"Unable to update Review"})
    }
    return res.status(401).send({message:"You are not able to update this review"})
}))
// delete review
reviewRouter.delete('/delete/:id', isAuth, expressAsyncHandler(async (req, res) => {
    const user = req.user.id;
    const reviewId = req.params.id;
    const review = await Review.findOne({ where: { id: reviewId } })
    if (!review) {
        return res.status(400).send({message:"No Review Found"})
    }
    if (review.user === user || req.user.isAdmin === true || req.user.isVendor === true) {
        
        await review.destroy();

        return res.status(200).send({message:"Review Deleted Successfully"})
    }
    else {
        return res.status(403).send({message:'You are not Allowed'})
    }
    
    
}))

export default reviewRouter;