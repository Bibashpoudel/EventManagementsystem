import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import Service from '../model/serviceModel.js'
import { isAuth } from '../utils.js'



const serviceRouter = express.Router()

serviceRouter.get('/', expressAsyncHandler(async (req, res) => {
    const categories = req.query.category || '';
    const city = req.query.city || '';
    const cityFilter = city ? { city } : {};
    const categoryFilter = categories ? { categories } : {};
    

    // const count = await Service.count({
    //     ...sellerFilter,
    //     ...categoryFilter,
       
    // });

    const service = await Service.find({
        ...cityFilter,
        ...categoryFilter,
    }).populate('categories', 'name')
    if (service) {
        return res.status(200).send(service)
    }
    return res.status(200).send({message:"No Service Avaialabe"})   
}))
serviceRouter.get('/venue', expressAsyncHandler(async (req, res) => {
    const city = req.query.city || '';
    const cityFilter = city ? { city } : {};
    const subcategories = req.query.subcategories || '';
    const subcategoriesFilter = subcategories ? { subcategories } : {};

    const service = await Service.find({
        ...cityFilter,
        ...subcategoriesFilter

    }).populate('city', 'name').populate('categories', 'name').populate('subcategories','name')
    const count = await Service.count({
        ...cityFilter,
        ...subcategoriesFilter
    })
    if (count === 0) {
        return res.status(404).send({ message: ' No Venue Found' });
    }
    let x = 0;
    
    let Venue = []
    try {
        for (x; x < count; x++){
            if (service[x].categories.name === 'venue') {
                Venue.push(service[x])
         }
        
        }
        if (Venue.length !== 0) {
         return res.status(200).send(Venue)
     }
    } catch (error) {
        res.send({message:error})
    }

}))
//trending venue
serviceRouter.get('/trending', expressAsyncHandler(async (req, res) => {
    const city = req.query.city || '';
    const cityFilter = city ? { city } : {};
    const isTrending = true
    const trendingFilter = isTrending ? { isTrending } : {};

    const service = await Service.find({
        ...cityFilter,
        ...trendingFilter
      
    }).populate('categories', 'name').populate('city')
    const count = await Service.count({
        ...cityFilter,
        ...trendingFilter
    })

    let x = 0;
    
    let Trending = []
    if (count === 0) {
        return res.status(404).send({ message: ' No Trending Venue Found' });
    }
   try {
       for (x; x < count; x++){
           if (service[x].categories.name === 'venue') {
            Trending.push(service[x])
        }
       
       }
       if (Trending.length !== 0) {
        return res.status(200).send(Trending)
    }
   } catch (error) {
       res.send({message:error})
   }
    
    
    // if (service) {
    //     return res.status(200).send(service)
    // }
    return res.status(500).send({message:'somethings Went wrong'})
}))
//popular service excluding venue
serviceRouter.get('/popular', expressAsyncHandler(async (req, res) => {
    const service = await Service.find().sort({ 'rating': -1 }).limit(3)
    res.status(200).send(service)
}))

// getting servie Details
serviceRouter.get('/:id', expressAsyncHandler(async (req, res) => {
    const serviceId = req.params.id;
    const service = await Service.findById(serviceId);
    return res.status(200).send(service)
}))

//adding service
serviceRouter.post('/add', expressAsyncHandler(async (req, res) => {
    

    try {
        const service = new Service({
            name: req.body.name,
            price: req.body.price,
            image: req.body.image,
            features: req.body.features,
            address: req.body.address,
            categories: req.body.categories,
            city: req.body.city,
            subcategories: req.body.subcategories,
            isTrending:req.body.isTrending
        })

        await service.save()
        return res.status(201).send(service)
    }
    catch (error) {
        return res.status(500).send(error)
    }
}))

// add review and and ratting
serviceRouter.post('/:id/review', isAuth, expressAsyncHandler(async (req, res) => {
    const serviceId = req.params.id;
    const service = await Service.findById(serviceId);
    if (service) {
        const review = {
            name: req.user.fullname,
            userId: req.user.id,
            rating: Number(req.body.rating),
            comment:req.body.comment
        }
        service.reviews.push(review);
        service.numReviews = service.reviews.length
        service.rating =
            service.reviews.reduce((a, c) => c.rating + a, 0) /
            service.reviews.length;
        const updateService = await service.save()
        res.status(201).send({
            message: 'Review Created',
            review: updateService.reviews[updateService.reviews.length - 1],
          });
    }
    else {
        res.status(404).send({ message: 'Service  Not Found' });
    }
})) 
// update reviews
serviceRouter.put('/update/review/:id', isAuth, expressAsyncHandler(async (req, res) => {
    const serviceId = req.body.service;
    const reviewId = req.params.id
    console.log(reviewId)
    
    const service = await Service.findById(serviceId);
    const review = service.reviews.find((a) => a.id === reviewId)
    console.log(review)
    service.reviews.find(a => {
        console.log(a._id)
    })
    const userId = req.user.id.toString()
    // if (review) {
    //     if (review.userId === userId) {
    //         console.log('1')
    //         review.rating=Number(req.body.rating),
    //         review.comment = req.body.comment
    //         console.log('2')
    //         service.reviews.update(review);
    //         console.log('3')
    //         service.rating =
    //             service.reviews.reduce((a, c) => c.rating + a, 0) /
    //             service.reviews.length;
    //         console.log('4')
    //         const updateService = await service.save()
    //         res.status(201).send({
    //             message: 'Review update',
    //             review: updateService.reviews[updateService.reviews.length - 1],
    //           });
            
    //     }
    //     else {
    //         return res.status(401).send({message:"Unauthorized User"})
    //     }
    // }
    if (review) {
        const removes = await review.remove()
        if (removes) {
            res.send({message:'delete successfull'})
        }
      
    }
}))

// get user review
serviceRouter.get('/review/user', isAuth, expressAsyncHandler(async (req, res) => {
    const service = await Service.find()
    const count = await Service.count();
    let Review = []
    console.log(count)
    let x = 0;
    const user = req.user.id.toString()
    for (x; x < count; x++){
        if (service[x].reviews.find((a) => a.userId === user)) {
            console.log('new')
            Review.push(service[x])
        }

    }
    return res.status(200).send(Review);
}))



export default serviceRouter