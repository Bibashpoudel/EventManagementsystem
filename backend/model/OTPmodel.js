import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
    
    email:{
        type:String,
        required:true,
        unique:true
    },
    code:{
        type:Number,
        required:true
    },
    verification: {
        type: Boolean,
        reuired: true,
        default:false
    }
},{
    timestamps: true
})

const OTP = mongoose.model('OTP', otpSchema);

export default OTP;