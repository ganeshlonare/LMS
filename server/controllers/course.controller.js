import { errorhandler } from "../utils/errorHandler.js"

export const getAllCourses=async (req,res,next)=>{
    try {
        
    } catch (error) {
        console.log("error in getting courses")
        console.log(error.message)
        return next(errorhandler(500,error.message))
    }
}