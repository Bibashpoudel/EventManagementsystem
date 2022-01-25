import mongoose from 'mongoose'


const categoriesSchema = new mongoose.Schema({
    name: {
        type:String
    },
    image: {
        type:String
    }
}, {
    timestamps:true
})

const Categories = mongoose.model('Categorie', categoriesSchema)

export default Categories;