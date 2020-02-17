const jwt=require('jsonwebtoken')
const Contributor=require('../models/contributor')


const auth=async (req,res,next)=>{
    try{
    const token=req.header('Authorization').replace('Bearer ','')
    const decode=jwt.verify(token,process.env.JWT_SECRET)
    const contributor= await Contributor.findOne({_id:decode._id,'tokens.token':token})
    if(!contributor){
        res.status(401).send('Please Authenticate!!!')
    }
    req.contributor=contributor
    req.token=token
    }catch(e){
        res.status(501).send(e)
    }
    next()
} 
module.exports=auth
