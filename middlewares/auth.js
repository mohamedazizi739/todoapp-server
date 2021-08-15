var jwt = require('jsonwebtoken');
const authorization=(req,res,next)=>{
   const authHeader=req.headers['authorization']
    const token=authHeader && authHeader.split(' ')[1]
   if (token == null) return res.sendStatus(401)
   jwt.verify(token, process.env.tokenKey, (err, user) => {
    if(err){return res.status(401).json({msg:"token not valid"})}
    req.user=user
    next()
   })
}
module.exports=authorization