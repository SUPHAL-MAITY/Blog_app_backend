
import mongoose ,{Schema} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"



const userSchema=new Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    countryCode:{
        type:Number,
        required:true,
        maxLength:2,
    },
    phone:{
        type:Number,
        required:true,

    },
    
    role:{
        type: String,
        enum: ['admin', 'viewer'], // Roles with specific permissions
        default: 'viewer',
    },
    status:{
        type:String,
        enum:["active","inactive"],
        default:"inactive"
    },
   
    password:{
        type:String,
        required:true
    },
    profileUrl:{
        type:String,
        default:"https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_640.png",
    },
    refreshToken:{
        type:String,
        
    }
   
    

},{timestamps:true})



// if any password is modified it will be hashed

userSchema.pre("save",async function(next){
    const user=this
    if(!user.isModified("password")) return next();
    this.password=await bcrypt.hash(this.password,10)
    next()
})



userSchema.methods.comparePassword=async function(password){
    return await bcrypt.compare(password,this.password)
}


userSchema.methods.generateAccessToken=function(){
    const payload={
        _id:this._id,
        email:this.email,
    }

    const options={
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }

  return jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET,options)



}



userSchema.methods.generateRefreshToken=function(){
    const payload={
        _id:this._id,
        email:this.email,
    }

    const options={
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }

  return jwt.sign(payload,process.env.REFRESH_TOKEN_SECRET,options)



}



userSchema.methods.verifyAccessToken=function(token){
    let decoded=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    return decoded;

}


userSchema.methods.verifyRefreshToken=function(token){
    let decoded=jwt.verify(token,process.env.REFRESH_TOKEN_SECRET)
    return decoded;

}









export const User=mongoose.model("User",userSchema)