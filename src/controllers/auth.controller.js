import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import {randomInt} from "crypto"


import { User } from "../models/user.model.js";
import twilio from 'twilio';



import jwt from  "jsonwebtoken";


dotenv.config()



const client=  twilio(process.env.TWILIO_ACCOUNT_SID,process.env.TWILIO_AUTH_TOKEN)










const otpSendController=asyncHandler(async(req,res)=>{
    const {countryCode,phone}=req.body
    console.log(process.env.TWILIO_ACCOUNT_SID)
   


    const message = await client.messages.create({
        body: "This is the ship that made the Kessel Run in fourteen parsecs?",
         from: '+16812442355',
        to: '+919804137946'
      });
   

    return res.status(200).json(new ApiResponse(200,message ,"otp sent successfully"))



})


const loginController=asyncHandler(async(req,res)=>{

    const {phone}=req.body;

    if(!phone){
        throw new ApiError(400,"phone number necessary while logging in")
    }

    const user=await User.findOne({phone})
    console.log("user",user)
    if(!user){
        throw new ApiError(400,"user not found while logging in")
    }


   



    const otp=randomInt(1000,9999).toString()
    console.log(otp)

    console.log("user_id",user._id)


    const payload={
        otp,
        user:user._id.toString(),
        
       }


       const option={
        expiresIn:process.env.OTP_TOKEN_EXPIRY
    }

    console.log("OTP_TOKEN_EXPIRY",process.env.OTP_TOKEN_EXPIRY)


///**************************************open this later because its costly */
  
    // const message = await client.messages.create({
    //     body: `your verification code for blog app is ${otp}`,
    //      from: '+16812442355',
    //      to:`+${user.countryCode}${user.phone}`
    //   });

    //   if(!message){
    //     throw new ApiError(400,"message not sent")
    //   }

    
    
   
   
const otpToken= jwt.sign(payload,process.env.OTP_TOKEN_SECRET,option)
   

   
// const options={
//     maxAge: 3600000, // Cookie expires in 1 hour
//     httpOnly: true,  // Cookie cannot be accessed by JavaScript
//     secure: false,   // Set to true if using HTTPS
//     sameSite: 'None' 
// }


const resUser=await User.findOne({_id:user._id}).select("-password -refreshToken")


// res.setHeader("Authorization",`Bearer ${otpToken}`)

// res.setHeader("Set-Cookie",`otpToken=${otpToken}; HttpOnly; Path=/; SameSite=None; Secure`)



return res.status(200).json(new ApiResponse(200,{user:resUser,otpToken},"otp sent successfully" ))
   
 


})


const validateOtpController=asyncHandler(async(req,res)=>{
    const {otp,otpToken}=req.body
   

    if( !otp){
        throw new ApiError(400,"otp  is missing")
    }

    if(!otpToken ){
        throw new ApiError(400,"otp token  is missing")
    }

    
    
   ///accessing the token from header

    // const otpAuth=req.headers["authorization"]
    // console.log("otpAuth",otpAuth)
    // if(!otpAuth){
    //     throw new ApiError(400,"otp auth  is missing")
    // }

    // const otpToken=otpAuth.split(" ")[1]



    


    const decodedToken=jwt.verify(otpToken,process.env.OTP_TOKEN_SECRET)
    console.log("decoded otpToken",decodedToken)

    if(!decodedToken){
        throw new ApiError(400,"otp token is not valid")
    }





 



    ////match the otp ????????????????????????????????????????


    if(otp!==decodedToken.otp){
        throw new ApiError(401,"otp is not valid or expired.....please login again")
    }



   const user= await User.findById(decodedToken.user)

   if(!user){
    throw new ApiError(400,"user not found while validating otp")
   }

   const accessToken=user.generateAccessToken()
   const refreshToken=user.generateRefreshToken()

   user.refreshToken=refreshToken
   await user.save()





//  return res.status(200).cookie("accessToken",accessToken).cookie("refreshToken",refreshToken).json(new ApiResponse(200,{},"otp verified successfully"))

return res.status(200).json(new ApiResponse(200,{user, accessToken,refreshToken},"otp verified successfully"))

})


const checkAuth=asyncHandler(async(req,res)=>{

    
    const accessTokenAuthorization=req.headers["authorization"];
    

    if(!accessTokenAuthorization){
        throw new ApiError(401,"Access token is missing ")
    }




    const accessToken=accessTokenAuthorization.split(" ")[1]

    if(!accessToken){
        throw new ApiError(401,"Access token is missing please login again")
    }


    let decodedAccessToken;



    try {

        decodedAccessToken=jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
        
    

        
    } catch (error) {

       
            throw new ApiError(401, "access token is invalid or expired , please login again.");
        }
        
        
    const user=await User.findById(decodedAccessToken._id)

    if(!user){
        throw new ApiError(401,"user not found while validating access token in check auth")
    }

   return res.status(200).json(new ApiResponse(200,{role:user.role},"access Token has decoded into role successfully"))

    



})









export {otpSendController,loginController,validateOtpController,checkAuth}