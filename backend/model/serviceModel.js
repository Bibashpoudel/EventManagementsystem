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
    address: {
      type:String  
    },
    categories: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Categorie'
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'City'
    },
    subcategories: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Subcategorie'
    },
    isTrending: {
        type: Boolean,  
    }
}, {
    timestamps:true
})
const Service = mongoose.model('Service', serviceSchema);
export default Service