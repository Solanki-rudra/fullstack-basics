import dotenv from 'dotenv';
import { connectDB } from "./db/index.js";
import { app } from './app.js';

dotenv.config({
    path:"./.env"
})

const PORT =  process.env.PORT || 8080

connectDB()
.then(()=>{
    app.on("error",(error)=>{
        console.error(`Error ${error}`)
        throw error
    })
    app.listen(PORT, ()=>{
        console.log(`Server listening on ${PORT}`)
    })
})
.catch((error)=>{
    console.error(`MongoDB connection failed: ${error}`)
})