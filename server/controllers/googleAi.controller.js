import run from "../utils/googleApi.js"
import { errorhandler } from "../utils/errorHandler.js"

export const chatWithAi=async (req,res,next)=>{
    const {query}=req.body
    try {
        const response=await run(query)
        return res.status(200).json({
            success:true,
            message:`About you query`,
            data:response
        })
    } catch (error) {
        console.log('error in google controller')
        console.log(error.message)
        return next(errorhandler(500,error.message))
    }
}