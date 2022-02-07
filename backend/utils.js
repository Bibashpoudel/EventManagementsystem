
import jwt from 'jsonwebtoken'
 
const generateToken = (user) =>{
    return jwt.sign({
        id:user.id,
        fullname: user.fullname,
        phone:user.phone,
        email:user.email,
        isAdmin: user.isAdmin,
        isVendor: user.isVendor,
        isCustomer:user.isCustomer
    }, process.env.JWT_SECRET || "keepsecretbibash" , {
        expiresIn: '30d',
    });
};

const isAuth =(req, res, next)=>{
    const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length); // Bearer XXXXXX
    jwt.verify(
      token,
      process.env.JWT_SECRET || 'keepsecretbibash',
      (err, decode) => {
        if (err) {
          res.status(401).send({ message: 'Invalid Token' });
        } else {
          req.user = decode;
          next();
        }
      }
    );
  } else {
    res.status(401).send({ message: 'No Token' });
  }
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