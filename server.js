import { connectDB } from "./src/db/index.js";
import { app } from "./src/App.js";
import dotenv from "dotenv"

dotenv.config()




connectDB().then(()=>{
    app.listen(3000,()=>{
        console.log("db connected")

    })
    
})

.catch((err)=>{
    console.log("database connection error",err)
})