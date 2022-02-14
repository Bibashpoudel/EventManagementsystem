import mongoose from 'mongoose'


const serviceImage = new mongoose.Schema({
    image: {
        type: String
    },
    caption: {
        type: String,
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
    }
}, {
    timestamps: true
})

const ServiceImage = mongoose.model('ServiceImage', serviceImage);

export default ServiceImage;