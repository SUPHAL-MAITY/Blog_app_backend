import mongoose ,{Schema} from "mongoose";



const otpSchema=new Schema({
    otp:{
        type:String,
        required:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User"

    },
    expiresAt: {
        type: Date,
        required: true,
    },

  
  })


otpSchema.index({expiresAt:1},{expiresAfterSeconds:0})







export const Otps=mongoose.model("Otps",otpSchema)