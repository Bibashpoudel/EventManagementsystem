import mongoose from 'mongoose'


const serviceSchema = new mongoose.Schema({
    
    name: {
        type:String,
    },
    
    price: {
        type:String
    },
    image: {
        type:String,
    },
    features: {
        type:String
    },
    categories: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Categorie'
    }

    
})