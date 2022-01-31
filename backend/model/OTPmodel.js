import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
    
    code:{
        type:String,
        required:true
    },
    verification: {
        type: Boolean,
        reuired: true,  
    },
    expire_time: {
        type: Date,
    }
},{
    timestamps: true
})

const OTP = mongoose.model('OTPEmail', otpSchema);

export default OTP;