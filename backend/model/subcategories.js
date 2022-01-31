import mongoose from 'mongoose'


const subcategoriesSchema = new mongoose.Schema({
    name: {
        type:String
    },
    image: {
        type:String
    }
    ,
    categories: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Categorie'
    }
}, {
    timestamps:true
})

const SubCategories = mongoose.model('Subcategorie', subcategoriesSchema)

export default SubCategories;