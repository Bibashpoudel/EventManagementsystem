import express from 'express'
import expressAsyncHandler from 'express-async-handler';
import ServiceDetails from '../model/serviceDetailsModel.js';
import { isAuth, isVendor, isVendorOrAdmin } from '../utils.js';



const serviceDetailsRouter = express.Router();



serviceDetailsRouter.post('/add', isAuth, expressAsyncHandler(async (req, res) => {
    const service = req.body.service;
    try {
        const servicedetails = new ServiceDetails({
            name: req.body.name,
            capacity: req.body.capacity,
            image: req.body.image,
            price: req.body.price,
            service:service
        })
        const newServiceDetails = await servicedetails.save()
        return res.status(201).send({message:"Details has been Added" ,details:newServiceDetails})
    } catch (error) {
        return res.status(500).send({message:error.message})
    }
}))

// get serviceDetails for particular venue
serviceDetailsRouter.get('/venue', expressAsyncHandler(async (req, res) => {
    const service = req.query.service;
    
    try {
        const serviceDetails = await ServiceDetails.find({ service: service });
        if (serviceDetails) {
          
            return res.status(200).send(serviceDetails)
        }
       
    } catch (error) {
        return res.status(500).send({message:error.message})
    }
}))
//update
serviceDetailsRouter.put('/update/:id', isAuth, isVendorOrAdmin, expressAsyncHandler(async (req, res) => {
    const id = req.params.id;
    try {
        const serviceDetails = await ServiceDetails.findById(id);
        if (serviceDetails) {
            serviceDetails.name = req.body.name,
                serviceDetails.capacity = req.body.capacity,
                serviceDetails.image = req.body.image,
                serviceDetails.price = req.body.price
            
            const update = serviceDetails.save();

            return res.send({ message: "Details Update", serviceDetails: update })
        }
        return res.status(404).send({ message: "No Details Found" })
    } catch (error) {
        return res.status(500).send({ message: error.message })
    }
}));
//service Delete
serviceDetailsRouter.delete('/delete/:id', isAuth, isVendorOrAdmin, expressAsyncHandler(async (req, res) => {
    const id = req.params.id;
    try {
        const serviceDetails = await ServiceDetails.findById(id);
        if (serviceDetails) {
            await serviceDetails.remove()
            return res.send({ message: "Details Deleted", serviceDetails: update })
        }
        return res.status(404).send({ message: "No Details Found" })
    } catch (error) {
        return res.status(500).send({ message: error.message })
    }
}));

export default serviceDetailsRouter;