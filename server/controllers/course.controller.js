import Course from "../models/course.model.js"
import User from "../models/user.model.js"
import { errorhandler } from "../utils/errorHandler.js"
import cloudinary from 'cloudinary'
import fs from 'fs/promises'

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
        console.log("error in getting course by Id")
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
            return next(errorhandler(500,"Failed to create course"))
        }

        if(req.file){
            try {
                const result = await cloudinary.v2.uploader.upload(req.file.path, {
                    folder:'lms'
                });

                if(result){
                    course.thumbnail.public_id=result.public_id
                    course.thumbnail.secure_url=result.secure_url
                }
                fs.rm(`uploads/${req.file.filename}`)

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

//update course

export const updateCourse=async (req,res,next)=>{
    try {
    const {id}=req.params

    const course= await Course.findByIdAndUpdate(id,
        {$set:req.body},
        {runValidators:true}
    )

    if(!course){
        return next(errorhandler(400,"Course not found"))
    }

    return res.status(201).json({
        success:true,
        message:"Course updated successfully",
        course
    })
    
    } catch (error) {
        console.log("Error in updating user")
        console.log(error.message)
        return next(errorhandler(500,error.message))
    }
}

//Add lectures

export const addLectures=async (req,res,next)=>{
    try {
        const {title , description}=req.body
        const {id} =req.params

        if(!title || !description){
            return next(errorhandler(400,"All fields are required"))
        }

        const lecturesData={
            title,
            description,
            lecture:{}
        }

        const course=await Course.findById(id)
        if(!course){
            return next(errorhandler(400,"Course not found"))
        }

        if(req.file){
            try {
                const result = await cloudinary.v2.uploader.upload(req.file.path, {
                    folder:'lms',
                    chunk_size:50000000,
                    resource_type:'video'
                });

                if(!result){
                    return next(errorhandler(500,"Failed to upload video"))
                }

                lecturesData.lecture.public_id=result.public_id
                lecturesData.lecture.secure_url=result.secure_url
                fs.rm(`uploads/${req.file.filename}`)

            } catch (error) {
                console.log("file upload error:-",error)
                return next(errorhandler(500,error.message||"Error uploading file"))
            }
        }

        course.lectures.push(lecturesData)
        course.NumberOfLectures=course.lectures.length
        await course.save()

        return res.status(202).json({
            success:true,
            message:"Lecture added successfully",
            course
        })

    } catch (error) {
        console.log("Error in adding lectures")
        console.log(error.message)
        return next(errorhandler(500,error.message))
    }
}