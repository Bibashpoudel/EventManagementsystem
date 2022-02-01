import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import Service from '../model/serviceModel.js'



const serviceRouter = express.Router()

serviceRouter.get('/', expressAsyncHandler(async (req, res) => {
    const categories = req.query.category || '';
    const city = req.query.city || '';
    const isTrending = true;
    const cityFilter = city ? { city } : {};
    const categoryFilter = categories ? { categories } : {};
    const trendingFilter = isTrending ? { isTrending } : {};

    // const count = await Service.count({
    //     ...sellerFilter,
    //     ...categoryFilter,
       
    // });

    const service = await Service.find({
        ...cityFilter,
        ...categoryFilter,
        ...trendingFilter
    })
    if (service) {
        return res.status(200).send(service)
    }
    return res.status(200).send({message:"No Service Avaialabe"})
    

    
}))

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


export default serviceRouter