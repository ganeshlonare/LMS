import app from "./app.js";
import { dbConnect } from './db/dbConnect.js'

const PORT=process.env.PORT || 3000
app.listen(PORT,async()=>{
    await dbConnect()
    console.log('server in listening on port:-',PORT)
})