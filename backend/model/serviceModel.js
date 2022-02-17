import mongoose from 'mongoose'




const serviceSchema = new mongoose.Schema({
    
    name: {
        type:String,
    },
    minprice: {
        type:String
    },
    maxprice: {
        type:String
    },
    vegminprice: {
        type:String
    },
    vegmaxprice: {
        type:String
    },
    nonvegminprice: {
        type:String
    },
    nonvegmaxprice: {
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
    },
    rating: { type: Number, default:0},
    numReviews: { type: Number,default:0},
    
  
    
}, {
    timestamps:true
})
const Service = mongoose.model('Service', serviceSchema);
export default Service