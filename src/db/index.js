import mongoose from "mongoose";






const connectDB=async()=>{
    try {
       const connectionInstance= await mongoose.connect("mongodb+srv://suphal:z5wORl7KkVt5fBjE@cluster0.wrfvp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
       console.log(connectionInstance.connection.host)
    } catch (error) {
        console.log(error)
        
    }
}


export {connectDB}