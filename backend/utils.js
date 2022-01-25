
import jwt from 'jsonwebtoken'
 
const generateToken = (user) =>{
    return jwt.sign({
        _id:user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        mobile:user.mobile,
        email:user.email,
        isAdmin: user.isAdmin,
        isVendor: user.isVendor,
        isCustomer:user.isCustomer
    }, process.env.JWT_SECRET || "keepsecretbibash" , {
        expiresIn: '30d',
    });
};

const isAuth =(req, res, next)=>{
    const token = req.header.autorization;
    if(token){
        const onlyToken = token.slice(6 , token.lenght);
        jwt.verify(onlyToken, config.JWT_SECRET, (err, decode)=>{
            if(err){
                return res.status(401).send({message:"Invalid token"})
            }
            req.user = token;
            next();
            return;
        })
    }
    return  res.send(401).send({message:"token is not valid"})
}

const isAdmin = (req, res, next)=>{
    if (req.user && req.user.isAdmin){
        return next();
    }
    else{
        res.status(401).send({message:"is not admin"})
    }
}
const isVendor = (req, res, next) => {
    if (req.user && req.user.isVendor) {
        return next();
    }
    else {
        res.status(401).send({message:'is not Vendor'})
    }
}


export {
    generateToken,
    isAdmin,
    isAuth,
    isVendor
}