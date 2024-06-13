import mongoose from "mongoose";

mongoose.set('strictQuery',false)

export const dbConnect=async ()=>{
    try {
        const {connection}=await mongoose.connect(process.env.MONGODB_URI)
        
        if(connection){
            console.log("Database connected successfully")
        }
        
    } catch (error) {
        console.log("Error connecting DB!")
        console.log(error);
        process.exit(1)
    }
}