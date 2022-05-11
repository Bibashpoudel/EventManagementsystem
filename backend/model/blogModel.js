import mongoose from 'mongoose'


const blogSchema = new mongoose.Schema({
    tittle: {
        type:String
    },
    image: {
        type:String
    },
    postby:{
        type:String
    },
    content:{
        type:String
    }

}, {
    timestamps:true
})

const Blog = mongoose.model('Blog', blogSchema)

export default Blog;