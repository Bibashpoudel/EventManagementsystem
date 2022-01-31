import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import SubCategories from '../model/subcategories.js'


const subcategoriesRouter = express.Router()



subcategoriesRouter.post('/add', expressAsyncHandler(async (req, res) => {
    try {
        const subcategory = new SubCategories({
            name :req.body.name,
            image: req.body.image,
            categories:req.body.categories,
        })
        await subcategory.save()
        const response={"Status":"Success", "Details":" subCategory Added"}
        return res.status(200).send(response)
    
    } catch (error) {
        const response={"Status":"Failure", "Details":error}
        return res.status(400).send(response)
    }
    
}))

export default subcategoriesRouter;