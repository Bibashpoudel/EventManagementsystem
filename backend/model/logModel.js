import mongoose from "mongoose";


const logSchema = new mongoose.Schema({
    userid: {
        type:String,
    },
    username: {
      type:String  
    },
    action: {
        type:String
    },
    device: {
        type:String
    }

}, {
    timestamps:true
})

const Log = mongoose.model("Log", logSchema)

export default Log;