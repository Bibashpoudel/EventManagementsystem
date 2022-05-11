import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import City from '../model/cityModel.js'


const cityRouter = express.Router()



cityRouter.post('/add', expressAsyncHandler(async (req, res) => {

    try {
        const city = new City({
            name:req.body.name
        })
        await city.save()
        return res.status(201).send({message:"New City has been added"})

    } catch (error) {
        return res.status(500).send({message:"Some thing went wrong"})
    }
    
    
}))
cityRouter.get('/', expressAsyncHandler(async (req, res) => {
    const city = await City.find()
    if (city) {
        return res.status(200).send(city)
    }
}))
cityRouter.get('/:id', expressAsyncHandler(async (req, res) => {
    // const city = req.query.city || '';
    // const cityFilter = city ? { city } : {};

    const onecity = await City.findById(req.params.id);
        res.status(200).send(onecity)
    
}))

export default cityRouter;