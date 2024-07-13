import app from "./app.js";
import { dbConnect } from './db/dbConnect.js'
import cloudinary from 'cloudinary'
import Razorpay from 'razorpay'

const PORT=process.env.PORT || 3000

cloudinary.v2.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET_KEY,
})

export const razorPay=new Razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_SECRET
})

app.listen(PORT,async()=>{
    await dbConnect()
    console.log('server in listening on port:-',PORT)
})