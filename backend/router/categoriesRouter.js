import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import Categories from '../model/categoriesModel.js'


const categoriesRouter = express.Router()

categoriesRouter.get('/', expressAsyncHandler(async (req, res) => {
    const category = await Categories.find({})
    if (category) {
        return res.status(200).send(category)
    }
}))

categoriesRouter.post('/add', expressAsyncHandler(async (req, res) => {
    try {
        const category = new Categories({
            name :req.body.name,
            image : req.body.image
        })
        await category.save()
        const response={"Status":"Success", "Details":" Category Added"}
        return res.status(200).send(response)
    
    } catch (error) {
        const response={"Status":"Failure", "Details":error}
        return res.status(400).send(response)
    }
    
}))

export default categoriesRouter;