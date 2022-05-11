import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import Service from '../model/serviceModel.js'
import { isAuth } from '../utils.js'



const serviceRouter = express.Router()

serviceRouter.get('/all', expressAsyncHandler(async (req, res) => {
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
// getting servie Details

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
            if (service[x].categories.name === 'Venue') {
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
    

    try {
        const city = req.query.city || '';
        const cityFilter = city ? { city } : {};
        const isTrending = true;
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
            for (x; x < count; x++) {
                if (service[x].categories.name === 'Venue') {
                    Trending.push(service[x])
                }
           
            }
            if (Trending.length !== 0) {
                return res.status(200).send(Trending)
            }
        } catch (error) {
            res.send({ message: error })
        }
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
    
}));
//popular service excluding venue
serviceRouter.get('/popular', expressAsyncHandler(async (req, res) => {
    const service = await Service.find().sort({ 'rating': -1 }).limit(3)
    res.status(200).send(service)
}));
//adding service
serviceRouter.post('/add', expressAsyncHandler(async (req, res) => {
    

    try {
        const service = new Service({
            name: req.body.name,
            minprice: req.body.minprice,
            maxprice: req.body.maxprice,
            vegminprice: req.body.vegminprice,
            vegmaxprice: req.body.vegmaxprice,
            nonvegminprice: req.body.nonvegminprice,
            nonvegmaxprice: req.body.nonvegmaxprice,
            image: req.body.image,
            features: req.body.features,
            address: req.body.address,
            categories: req.body.categories,
            city: req.body.city,
            subcategories: req.body.subcategories,
            isTrending: req.body.isTrending
        })

        await service.save()
        return res.status(201).send(service)
    }
    catch (error) {
        return res.status(500).send(error)
    }
}));
serviceRouter.get('/details/:id', expressAsyncHandler(async (req, res) => {
    const serviceId = req.params.id;
    const service = await Service.findById(serviceId).populate('city').populate('subcategories', 'name');
    
    if (service) {
        return res.status(200).send(service)
    }
    return res.status(404).send({ message: 'No Service Found' });
}))




export default serviceRouter