import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { errorhandler } from '../utils/errorHandler.js';

const cookieOptions={
    httpOnly:true,
    maxAge: 7 * 24 * 60 * 60 * 1000,//7 days
    secure:true,
}

export const register=async(req,res,next)=>{
    const {fullName , email , password} = req.body;

    try {
        const userExist=await User.findOne({email})

        if(!fullName || !email || !password){
            return next(errorhandler(400,"All the fields are required"))
        }

        if(userExist){
            return next(errorhandler(401,"User already exist"))
        }

        const user=await User.create({
            fullName,
            email,
            password:await bcryptjs.hash(password,10),
            avatar:{
                public_id:email,
                secure_url:""
            }
        })

        if(!user){
            return next(errorhandler(500,"failed to register user"))
        }

        //todo

        await user.save()
        user.password=undefined

        const token=await user.generateJwtToken()
        if(!token){
            return next(errorhandler(401,"token is not generated"))
        }

        res.cookie('token',token,cookieOptions)

        return res.status(201).json({
            success:true,
            message:"User registered successfully"
        })

    } catch (error) {
        console.log("error in registering user")
        console.log(error)

        return res.json({
            success:false,
            message:"error registering user"
        }).status(500)
    }
}


//login
export const login=async (req,res,next)=>{
    const {email,password}=req.body
    try {
        if(!email || !password){
            return next(errorhandler(401,"All the fields are required"))
        }
        const user=await User.findOne({email}).select('+password')

        if(!user){
            return next(errorhandler(404,"User not found"))
        }

        console.log(user)

        const checkedPassword=await bcryptjs.compare(password,user.password)
        console.log('user:-',user.password)
        console.log(checkedPassword)

        if(!checkedPassword){
            return next(errorhandler(402,"Invalid Credentials"))
        }

        const token = await user.generateJwtToken()
        user.password=undefined
        if(!token){
            return next(errorhandler(401,"token is not generated"))
        }

        res.cookie('token',token,cookieOptions)

        return res.status(200).json({
            success:true,
            message:"User logged in successfully",
            user
        })

    } catch (error) {
        console.log('error in logging in user')
        console.log(error)
        return res.json({
            success:false,
            message:"error in logging in user"
        }).status(500)
    }
}

//logout
export const logout=(req,res)=>{
    try {
        const cookies=req.cookies.token
        console.log(cookies)
        if(!cookies){
         return next(errorhandler(404,"user not found"))
        }

    res.clearCookie('token' , { httpOnly: true, secure: true, sameSite: 'strict' })

    return res.json({
        success:true,
        message:"logged out"
    }).status(200)

    } catch (error) {
        return res.json({
            success:false,
            message:"error in log out"
        }).status(500)
    }
}

//getUser
export const getProfile=async (req,res)=>{
    try {
        const userId=req.user.id;

        const user=await User.findById(userId)

        return res.status(200).json({
            success:true,
            message:"User Details",
            user
        })
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"error in getting profile"
        })
    }
}