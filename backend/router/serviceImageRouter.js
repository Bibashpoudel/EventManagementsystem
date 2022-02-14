import express from 'express'
import expressAsyncHandler from 'express-async-handler';
import ServiceImage from '../model/serviceImageModel.js';
import { isAdmin, isAuth, isVendor, isVendorOrAdmin } from '../utils.js';


const serviceImageRouter = express.Router();


//image post  
serviceImageRouter.post('/add',isAuth,isVendorOrAdmin, expressAsyncHandler(async (req,res) => {
    try {
        const images = new ServiceImage({
            image: req.body.image,
            caption: req.body.caption,
            service:req.body.service
        })
        const saveImage = images.save();
        if (saveImage) {
            return res.status(201).send({message:"Image added succesfully"})
        }
        return res.status(400).send({message:"Could not save Image"})
    } catch (error) {
        return res.status(500).send({message:error.message})
    }
}))
// fetch all images
serviceImageRouter.get('/', expressAsyncHandler(async (req, res) => {
    try {
        const images = await ServiceImage.find()
        if (images) {
            return res.status(200).send(images)
        }
        return res.status(404).send({message:'No image added yet'})
    } catch (error) {
        return res.status(500).send({message:error.message})
    }
}))
// for particular service
serviceImageRouter.get('/service', expressAsyncHandler(async (req, res) => {
    const service = req.body.service
    try {
        const images = await ServiceImage.find({ service: service });
        if (images) {
            return res.status(200).send(images); 
        }
        return res.status(404).send({message:'No image added yet'})
    } catch (error) {
        return res.status(500).send({message:error.message})
    }
}))
serviceImageRouter.delete('/delete/:id',isAuth, isVendorOrAdmin, expressAsyncHandler(async (req, res) => {
    const id = req.params.id
    try {
        const image = await ServiceImage.findById(id);
        if (image) {
            await image.remove()
            return res.send({message:"Image deleted"}); 
        }
        return res.status(404).send({message:'No image found'})
    } catch (error) {
        return res.status(500).send({message:error.message})
    }
}))
//update image and caption
serviceImageRouter.put('/update/:id', isAuth, isVendorOrAdmin, expressAsyncHandler(async (req, res) => {
    const id = req.params.id
    try {
        const image = await ServiceImage.findById(id);
        if (image) {
            image.image = req.body.images,
            image.caption= req.body.caption
            
            const updateImages = await image.save();

            res.send({ message: 'images Updated', image: updateImages });
        }
        else {
            res.status(404).send({ message: 'Images Not Found' });
        }
    } catch (error) {
        return res.status(500).send({message:error.message})
    }
}))

