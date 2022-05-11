import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import Blog from '../model/blogModel'




const blogRouter = express.Router()


blogRouter.post('/', expressAsyncHandler(async(req, res)=>{

    try {
        const blog = new Blog({
            title:req.body.title,
            image:req.body.image,
            postby:req.body.postby,
            content:req.body.content
        })
        await blog.save()
        return res.status(201).send({message:"Blog added"})



    } catch (error) {
        return res.status(500).send({message:"Some thing went wrong"})
    }

}))
blogRouter.get('/two', expressAsyncHandler(async(req, res)=>{
    const blog = await Blog.find().sort({_id:-1}).limit(2);
    return res.status(200).send(blog)

}))