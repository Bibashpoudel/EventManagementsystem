import mongoose from 'mongoose'


const reviewSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        userId:{type:String, required:true},
        comment: { type: String, required: true },
        rating: { type: Number, required: true },
    },
    {
        timestamps: true,
    }
);

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
    },
    rating: { type: Number, required: true },
    numReviews: { type: Number, required: true },
    reviews: [reviewSchema],
  
    
}, {
    timestamps:true
})
const Service = mongoose.model('Service', serviceSchema);
export default Service