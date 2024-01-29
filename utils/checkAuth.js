import jwt from 'jsonwebtoken';

export default (req,res,next)=>{
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

    if(token){

    } else {
        res.status(403).json({
            message:"Нет доступа "
        })
    }

    res.send(token);
    next();
};