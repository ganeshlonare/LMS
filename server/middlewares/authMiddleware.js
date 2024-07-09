import { errorhandler } from "../utils/errorHandler.js"
import jwt from 'jsonwebtoken'

export const isUserLoggedIn=async (req,res,next)=>{
    try {
        const {token} = req.cookies
        if (!token) {
            return next(errorhandler(401,"User is not logged in"))
        }

        const userDetails=await jwt.verify(token,process.env.JWT_SECRET_KEY)

        req.user=userDetails;

        next();

    } catch (error) {
        console.log("error in isUserLoggedIn")
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}

export const isAuthorized=(...roles) =>(req,res,next)=>{
    try {
        const currentRole=req.user.role

        if(!roles.includes(currentRole)){
            return next(errorhandler(401,"You don't have the permission to this route"))
        }

        next()
    } catch (error) {
        console.log("Error in authorize")
        console.log(error.message)
        return next(errorhandler(500,error.message))
    }
}

