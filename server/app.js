import express, { urlencoded } from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { config } from 'dotenv'
import UserRouter from './routes/user.route.js'
import morgan from 'morgan'
import errorMiddleware from './middlewares/errorMiddleware.js'
config()

const app=express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({
    origin:process.env.FE_UEL,
    credentials:true
}))
app.use(cookieParser())
app.use(morgan('dev'))


app.get('/home',(req,res)=>{
    res.send('Welcome to Home Page')
})

//routes
app.use("/api/v1/user",UserRouter)


app.use(errorMiddleware)

app.all('*',(req,res)=>{
    res.json({
        success:false,
        message:"Page not found"
    }).status(404)
})


export default app