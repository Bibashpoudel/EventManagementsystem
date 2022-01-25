import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    phone: {
        type: String,
        require:true
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        default:false,
        required:true
    },
    isVendor: {
        type: Boolean,
        default: false,
        required:true
    },
    isCustomer: {
        type: Boolean,
        default: false,
        required:true
    }
    
},{
    timestamps: true
})

const User = mongoose.model('User', userSchema);

export default User;