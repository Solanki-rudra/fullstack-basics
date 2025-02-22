import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


export const connectDB = async () => {
    try {
        const connectionInit = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log(`connectionInit: ${connectionInit}`)
    } catch (error) {
        console.error(`DataBase connection error ${error}`)
    }
}