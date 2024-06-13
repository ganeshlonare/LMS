import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
config()

const app = express()

app.use(express.json())

app.use(cors({
    origin:[process.env.FE_URL],
    credentials: true
}));

app.use(cookieParser())

app.use("/home",(req,res)=>{
    res.send("Hello World")
})

//module route


//beyond all these routes
app.all('*',(req,res)=>{
    res.status(404).send("Page Not Found")
})

export default app