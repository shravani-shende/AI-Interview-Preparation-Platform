const jwt = require("jsonwebtoken")
const {redisClient} = require("../config/redis")

async function authLogoutUser(req,res,next){
    const token = req.cookies.token || getBearerToken(req)

    if(!token){
        return res.status(401).json({
            message:"unauthorized user."
        }
    )}

    const isBlacklisted = await redisClient.get(`blacklist:${token}`);
    console.log(isBlacklisted)

    if(isBlacklisted){
        return res.status(401).json({
            message:"user is already loged out please login again"
        })
    }

    try{
        const decode = await jwt.verify(token , process.env.JWT_SECRET)
        req.authToken = token
        req.user= decode
        next()
    }catch(err){
        return res.status(401).json({
            message:"invalid or expired token"
        })
    }
    
}

const authUser = async (req,res,next)=>{
    const token = req.cookies.token || getBearerToken(req)
    if(!token){
        return res.status(401).json({
            message:"unauthrized."
        })
    }
     try{
        const decode = await jwt.verify(token , process.env.JWT_SECRET)
          req.authToken = token
        req.user= decode
        next()
    }catch(err){
        return res.status(401).json({
            message:"invalid or expired token"
        })
    }

    
}

function getBearerToken(req) {
    const authorization = req.headers.authorization
    return authorization?.startsWith("Bearer ")
        ? authorization.slice(7)
        : null
}

module.exports= {authLogoutUser,authUser}