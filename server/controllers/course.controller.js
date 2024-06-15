import Course from "../models/course.model.js"
import User from "../models/user.model.js"
import { errorhandler } from "../utils/errorHandler.js"
import cloudinary from 'cloudinary'

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

//create courses

export const createCourse=async (req,res,next)=>{
    const {title , description , category , createdBy} = req.body
    try {
        if(!title || !description || !category ||!createdBy){
            return next(errorhandler(400,"Please fill all the fields"))
        }

        const course=await Course.create({
            title,
            description,
            category,
            createdBy,
            createdById:req.user.id,
            thumbnail:{
                public_id:title,
                secure_url:"https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg"
            }
        })
        if(!course){
            return next(errorhandler(400,"Failed to create course"))
        }

        if(req.file){
            try {
                const result = await cloudinary.v2.uploader.upload(req.file.path, {
                    folder:'lms'
                });

                if(result){
                    course.thumbnail.public_id=result.public_id
                    course.thumbnail.secure_url=result.secure_url

                    fs.rm(`uploads/${req.file.filename}`)
                }

            } catch (error) {
                console.log("file upload error:-",error)
                return next(errorhandler(500,error.message||"Error uploading file"))
            }
        }

        await course.save()
        return res.status(201).json({
            success:true,
            message:"Course created successfully",
            course
        })

    } catch (error) {
        console.log("Error in creating course")
        console.log(error.message)
        return next(errorhandler(500,error.message))
    }
}

//delete course

export const deleteCourse=async(req,res,next)=>{
    const {id} = req.params
    try {

        const course=await Course.findById(id)

        if(!course){
            return next(errorhandler(404,"Course not found"))
        }

        const courseToDelete=await Course.findByIdAndDelete(id)

        return res.status(201).json({
            success:true,
            message:"Course deleted successfully"
        })

    } catch (error) {
        console.log("Error in deleting use")
        console.log(error.message)
        return next(errorhandler(500,error.message))
    }
}