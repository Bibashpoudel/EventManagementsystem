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

export default cityRouter;