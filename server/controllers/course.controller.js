import Course from "../models/course.model.js"
import { errorhandler } from "../utils/errorHandler.js"

//get all courses
export const getAllCourses=async (req,res,next)=>{
    try {
        const courses= await Course.find({}).select('-lectures')

        if(!courses){
            return next(errorhandler(404,"Courses not found"))
        }

        return res.status(200).json({
            success:true,
            message:"Courses listed",
            courses
        })
    } catch (error) {
        console.log("error in getting courses")
        console.log(error.message)
        return next(errorhandler(500,error.message))
    }
}

//get lectures by id
export const getLecturesById=async (req,res,next)=>{
    const {id}=req.params
    try {
        const course = await Course.findById(id)
        if(!course){
            return next(errorhandler(404,"Course not found"))
        }

        return res.status(200).json({
            success:true,
            message:"Course found",
            course
        })
    } catch (error) {
        console.log("error in getting courses by Id")
        console.log(error.message)
        return next(errorhandler(500,error.message))
    }
}