
import mongoose from 'mongoose'

const serviceDetails = new mongoose.Schema({
    name: {
        type: String
    },
    capacity: {
        type: String,
    },
    image: {
        type:String
    },
    price: {
        type:String
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
    }
}, {
    timestamps: true
})

const ServiceDetails = mongoose.model('ServiceDetails', serviceDetails);

export default ServiceDetails;