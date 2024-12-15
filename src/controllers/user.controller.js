import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {User} from "../models/user.model.js" 
import { Blogs } from "../models/blogs.model.js";


const createUserController=asyncHandler(async(req,res)=>{
    const {name,email,countryCode,phone,password,profileUrl}=req.body;
    if([name,email,countryCode,phone,password,profileUrl].some((value)=>value?.trim()==="")){
        throw new ApiError(400,"All fields are necessary while creating a user")
    }

    const exisingUser=await User.findOne({email})

    if(exisingUser){
        throw new ApiError(400,"user already exists")
    }
    let role="viewer"

    const user=await User.create({name,email,countryCode,phone,password,role,profileUrl})
    if(!user){
        throw new ApiError(400,"user not created")
    }

    return res.status(200).json(new ApiResponse(200,{},"User Created Sucessfully"))

})


const editUserController=asyncHandler(async(req,res)=>{
    const id=req.user;
    if(!id){
        throw new ApiError(400,"id not found while updating a user")
    }
    const {name,email,phone,profileUrl}=req.body;
    console.log(name,email,phone,profileUrl)
    if(!name || !email || !phone || !profileUrl){
        throw new ApiError(400,"All fields are necessary while updating a user")
    }
    const user=await User.findByIdAndUpdate({_id:id},{name,email,phone,profileUrl})
    if(!user){
        throw new ApiError(400,"user not updated")
    }
    return res.status(200).json(new ApiResponse(200,{},"User Updated Sucessfully"))
})

const deleteUserController=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    console.log(id)
    if (!id) {
       
        throw new ApiError(400, "User ID is required");
      }
    
    const user=await User.findByIdAndDelete({_id:id})
    if(!user){
        throw new ApiError(400,"user not deleted")
    }
    return res.status(200).json(new ApiResponse(200,{},"User Deleted Sucessfully"))
})








const getAllUsersController=asyncHandler(async(req,res)=>{
    
    const page=parseInt(req.query.page) ||1;   
    const limit=5;
    const skip=(page-1)*limit;

    const users=await User.find({}).skip(skip).limit(limit).sort({createdAt:-1})
    if(!users){
        throw new ApiError(400,"users not found")
    }


    const totalUsers=await User.countDocuments();
    if(!totalUsers){
        throw new ApiError(400,"total users not found")
    }
    

    const totalPages=Math.ceil(totalUsers/limit);
    if(!totalPages){
        throw new ApiError(400,"total pages not found")
    }

    return res.status(200).json(new ApiResponse(200,{users,recentPage:page,totalPages, length:users.length}," all users fetched sucessfully"))
})


const changeuserRoleController=asyncHandler(async(req,res)=>{
   
    const {id,role}=req.body;
    console.log(id,role)
    if(!id || !role){
        throw new ApiError(400,"id  and role  necessary while changing a role")
    }
    const user=await User.findById({_id:id})
    console.log(user)
    if(!user){
        throw new ApiError(400,"user not found while changing the role")
    }

    

   if(role==="admin"){
    const updatedUser=await User.findByIdAndUpdate({_id:id},{role:"viewer"})
    console.log( "admin to viewer" ,updatedUser)
    
     }else {
        const updatedUser=await User.findByIdAndUpdate({_id:id},{role:"admin"})
        console.log( "viewer to admin" ,updatedUser)
       
     }
   
  
  

   
    return res.status(200).json(new ApiResponse(200,{},"User Role Updated Sucessfully"))
})



const changeuserStatusController=asyncHandler(async(req,res)=>{
   
    const {id,status}=req.body;
    console.log(id)
    if(!id || !status){
        throw new ApiError(400,"id  and status  necessary while changing a role")
    }
    const user=await User.findById({_id:id})
    console.log(user)
    if(!user){
        throw new ApiError(400,"user not found while changing the status")
    }

    

   if(status==="active"){
    const updatedUser=await User.findByIdAndUpdate({_id:id},{status:"inactive"})
    console.log( "active to inactive" ,updatedUser)
    
     }else {
        const updatedUser=await User.findByIdAndUpdate({_id:id},{status:"active"})
        console.log( "inactive to active" ,updatedUser)
       
     }
   
  
  

   
    return res.status(200).json(new ApiResponse(200,{},"User status Updated Sucessfully"))
})




const getOwnUserController=asyncHandler(async(req,res)=>{
    const id=req.user;
    console.log("id in own user ",id)
    if(!id){
        throw new ApiError(400,"id is necessar while getting own profile")
    }

    const user=await User.findById(id)
    if(!user){
        throw new ApiError(400,"user not found")
    }
    return res.status(200).json(new ApiResponse(200,user,"own details fetched sucessfully"))
})




const getAdminDetailsController=asyncHandler(async(req,res)=>{
    let numberOfUsers=await User.countDocuments({})
    if(!numberOfUsers){
        numberOfUsers=0;
    }

    let numberOfActiveUser=await User.countDocuments({status:"active"})
    if(!numberOfActiveUser){
        numberOfActiveUser=0;
    }

    let numberOfInactiveUser=await User.countDocuments({status:"inactive"})
    if(!numberOfInactiveUser){
        numberOfInactiveUser=0;
    }

    let numberOfBlogs=await Blogs.countDocuments({})
    if(!numberOfBlogs){
        numberOfBlogs=0;
    }


    let numberOfAdmins=await User.countDocuments({role:"admin"})
    if(!numberOfAdmins){
        numberOfAdmins=0
    }

    let numberOfActiveBlogs=await Blogs.countDocuments({status:"published"})

    if(!numberOfActiveBlogs){
        numberOfActiveBlogs=0;
    }

    let numberOfInactiveBlogs=await Blogs.countDocuments({status:"inactive"})
    if(!numberOfInactiveBlogs){
        numberOfInactiveBlogs=0;
       
    }

    const Categories=await Blogs.distinct("category")
    if(!Categories){
        throw new ApiError(400,"no of Categories not found")
    }

    let numberOfCategories=Categories.length 
    if(!numberOfCategories){
        numberOfCategories=0;
        
    }

    const data={
        numberOfUsers,
        numberOfActiveUser,
        numberOfInactiveUser,
        numberOfAdmins,
        numberOfBlogs,
        numberOfActiveBlogs,
        numberOfInactiveBlogs,
        numberOfCategories,
        Categories

    }

    return res.status(200).json(new ApiResponse(200,data," All details for users fetched Successfully"))





})



const searchUserController=asyncHandler(async(req,res)=>{

    const item=req.query.q;
    console.log(item)
    if(!item){
        throw new ApiError(400,"Items are not found in Search Bar")
        
    }

    const  users=await User.find({  $or:[
                                        {name:{$regex:item,$options:"i"}}
                                       
        
    ] })

   
 
    if(! users){
        throw new ApiError(400,"users not found")
    }
    return res.status(200).json(new ApiResponse(200,{users,length:users.length},"users fetched successfully"))

})


export {searchUserController,  createUserController,editUserController,deleteUserController,getAllUsersController,changeuserRoleController,getOwnUserController,getAdminDetailsController,changeuserStatusController}