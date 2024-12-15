import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";


const verifyJwtToken=asyncHandler(async(req,res,next)=>{


  

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

        if(error.name==="TokenExpiredError"){
            console.log("acess token is expired")
        }else{

            console.log("access token is invalid")
            throw new ApiError(401, "access token is invalid.");

        }
        
        
    }



    

    if(decodedAccessToken){
        req.user=decodedAccessToken.user;  //// id attached to req.user
        return next();
    }

    
    ////////check refresh token

    const refreshToken=req.headers["x-refresh-token"]

    if(!refreshToken){
        throw new ApiError(401,"Refresh token is missing ")
    }


    let decodedRefreshToken;

   
   try {
 
       decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET); 

     } catch (err) {
        if(err.name==="TokenExpiredError"){
            throw new ApiError(401,"Refresh token is expired, login again")
        }else{

            throw new ApiError(401, "Refresh token is invalid.");

        }

          

   }





    /////// need to work on this part   --- how to refresh the access token without breaking the chain of middleware 

   if(decodedRefreshToken){


        console.log("this is a case of  failure ot refresh the access token")

      
        const user=await User.findById(decodedRefreshToken._id)

        if(!user){
            throw new ApiError(401,"user not found in refresh token")
        }   

        const newAccessToken=user.generateAccessToken()

        
       
        req.newAccessToken=newAccessToken ;
        req.user=decodedRefreshToken.user;  //// id attached to req.user

        res.json({refreshToken})

        next()

    }




    
})







const decodeToken=asyncHandler(async(req,res,next)=>{
    const token=req.headers["authorization"].split(" ")[1]
    console.log("token from headers",token)
    if(!token){
        throw new ApiError(401,"token is missing while decoding token for auth controller")
    }

    const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    if(!decodedToken){
        throw new ApiError(401,"token is invalid while decoding token for auth controller")
    }


    req.user=decodedToken._id;
    next()



})


const isAdmin=asyncHandler(async(req,res,next)=>{
    const _id=req.user;
    const user=await User.findById(_id)
    if(!user){
        throw new ApiError(401,"user not found in sdmin  check middleware")
    }

    if(user.role!=="admin"){
        throw new ApiError(401,"user is not admin in middleware")
    }

    next()
})




export {verifyJwtToken,isAdmin,decodeToken}