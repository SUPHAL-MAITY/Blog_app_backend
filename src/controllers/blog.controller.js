import { Blogs } from "../models/blogs.model.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";



const createBlogcontroller=asyncHandler(async(req,res)=>{

    
    const {title,content,category,imageUrl}=req.body;

    let author=req.user;
    console.log(author)

    if([title,content,author,category,imageUrl].some((value)=>value?.trim()==="")){
        throw new ApiError(400,"All fields are necessary while creating a blog")
    }
    

    const blog=await Blogs.create({title,content,author,category,imageUrl})

    if(!blog){
        throw new ApiError(400,"blog not created")
    }

    return res.status(200).json(new ApiResponse(200 ,blog,"blog created successfully"))
    
   


})

const deleteBlogController=asyncHandler(async(req,res)=>{

    const {id}=req.params;

    if(!id){
        throw new ApiError(400,"id  not found while deleting a blog")
    }

    await Blogs.findByIdAndDelete({_id:id})

    return res.status(200).json(new ApiResponse(200,{},"blog deleted successfully"))
   


})


const updateBlogController=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    const {title,content,category,imageUrl}=req.body;
    if([title,content,category,imageUrl].some((value)=>value?.trim()==="")){
        throw new ApiError(400,"All fields are necessary while updating a blog")
    }
    const blog=await Blogs.findByIdAndUpdate({_id:id},{title,content,category})
    if(!blog){
        throw new ApiError(400,"blog not updated")
    }
    return res.status(200).json(new ApiResponse(200,blog,"blog updated successfully"))
})

// for admin  with pagination


const getAllBlogsController=asyncHandler(async(req,res)=>{

    const page=parseInt(req.query.page) ||1;   
    const limit=8;
    const skip=(page-1)*limit;

    const blogs=await Blogs.find({}).populate("author","name").skip(skip).limit(limit).sort({createdAt:-1})
    if(!blogs){
        throw new ApiError(400,"blogs not found")
    }

    const totalBlogs=await Blogs.countDocuments();
    if(!totalBlogs){
        throw new ApiError(400,"total blogs not found")
    }

    const totalPages=Math.ceil(totalBlogs/limit);
    if(!totalPages){
        throw new ApiError(400,"total pages not found")
    }



    return res.status(200).json(new ApiResponse(200,{blogs,recentPage:page,totalPages,length:blogs.length},"blogs fetched successfully"))
})



////all blogs for normal users

const getAllBlogsForUserController=asyncHandler(async(req,res)=>{


    const page=parseInt(req.query.page) ||1;   
    const limit=8;
    const skip=(page-1)*limit;



    const blogs=await Blogs.find({status:"published"}).populate("author","name").skip(skip).limit(limit).sort({createdAt:-1})
    if(!blogs){
        throw new ApiError(400,"blogs not found for all users")
    }


    const totalBlogs=await Blogs.countDocuments();

    if(!totalBlogs){
        throw new ApiError(400,"total blogs not found")


    }


    const totalPages=Math.ceil(totalBlogs/limit);
    if(!totalPages){
        throw new ApiError(400,"total pages not found")
    }

    

    return res.status(200).json(new ApiResponse(200,{blogs,recentPage:page,totalPages,length:blogs.length},"blogs fetched successfully"))
})





const getRecentBlogsController=asyncHandler(async(req,res)=>{
    const blogs=await Blogs.find({status:"published"}).sort({createdAt:-1}).limit(12).populate("author","name").exec()
     if(!blogs){
        throw new ApiError(400,"blogs not found")
    }
    return res.status(200).json(new ApiResponse(200,blogs,"recent blogs fetched successfully"))
})



const getSingleBlogController=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    const blog=await Blogs.findById(id).populate("author","name").exec()
    if(!blog){
        throw new ApiError(400,"blog not found")
    }
    return res.status(200).json(new ApiResponse(200,blog,"blog fetched successfully"))
})



const getOwnBlogsController=asyncHandler(async(req,res)=>{
    
    const id=req.user;

    const ownBlogs=await Blogs.find({author:id}).populate("author","name").exec()

    if(!ownBlogs){
        throw new ApiError(400,"blogs not found")
    }

    return res.status(200).json(new ApiResponse(200,{ownBlogs,length:ownBlogs.length},"own blogs fetched successffully"))


})


const getBlogsByPageController=asyncHandler(async(req,res)=>{

  

    const page=parseInt(req.query.page) || 1;
    const pageSize=parseInt(req.query.pageSize) || 2 ;

    const totalBlogs=await Blogs.countDocuments();
    const totalPage=Math.ceil(totalBlogs/pageSize)


    const skipBlogs=(page-1)*pageSize;

    const blogs=await Blogs.find({}).skip(skipBlogs).limit(pageSize).sort({createdAt:-1})
    if(!blogs){
        throw new ApiError(400,"blogs not found")
    }
    return res.status(200).json(new ApiResponse(200,{blogs,pageSize:blogs.length,totalBlogs,totalPage}," page wise blogs fetched successfully",))  
})


const changeBlogStatusController=asyncHandler(async(req,res)=>{
   
    const {id,status}=req.body;
    console.log(id)
    if(!id || !status){
        throw new ApiError(400,"id  and status  necessary while changing  status in blog")
    }
    const blog=await Blogs.findById({_id:id})
   
    if(!blog){
        throw new ApiError(400,"user not found while changing the status")
    }

    

   if(status==="inactive"){
    const updatedBlog=await Blogs.findByIdAndUpdate({_id:id},{status:"published"})
    console.log( "inactive to published" ,updatedBlog)
    
     }else {
        const updatedBlog=await Blogs.findByIdAndUpdate({_id:id},{status:"inactive"})
        console.log( "published to in active" ,updatedBlog)
       
     }
   
  
  

   
    return res.status(200).json(new ApiResponse(200,{},"Blog status Updated Sucessfully"))
})


const blogsByCategoriesController=asyncHandler(async(req,res)=>{
    const {category}=req.params;
    const page=parseInt(req.query.page) ||1;   
    const limit=5;
    const skip=(page-1)*limit;

    if(!category){
        throw new ApiError(400,"category is necessary")
    }
    
    const blogs=await Blogs.find({category,status:"published"}).populate("author","name").skip(skip).limit(limit).sort({createdAt:-1})
    if(!blogs){
        throw new ApiError(400,"blogs not found")
    }


    const totalBlogs=await Blogs.find({category,status:"published"}).countDocuments();
    if(!totalBlogs){
        throw new ApiError(400,"total blogs not found")
    }
    

    const totalPages=Math.ceil(totalBlogs/limit);
    if(!totalPages){
        throw new ApiError(400,"total pages not found")
    }





    return res.status(200).json(new ApiResponse(200,{blogs,recentPage:page,totalPages,length:blogs.length},"category wise blogs fetched successfully"))
})



const searchItemController=asyncHandler(async(req,res)=>{
   

    const item=req.query.q;
    console.log(item)
    if(!item){
        throw new ApiError(400,"Items are not found in Search Bar")
        
    }

    const blogs=await Blogs.find({  $or:[
                                        {title:{$regex:item,$options:"i"}},
                                        {content:{$regex:item,$options:"i"}},
        
    ] })

   
 
    if(!blogs){
        throw new ApiError(400,"blogs not found")
    }
    return res.status(200).json(new ApiResponse(200,{blogs,length:blogs.length},"blogs fetched successfully"))


})


const getPopularBLogsController=asyncHandler(async(req,res)=>{
    const blogs=await Blogs.find({tags:{$in:["popular"]}}).sort({createdAt:-1}).limit(5).populate("author","name").exec()   
    if(!blogs){
        throw new ApiError(400,"blogs not found in popular post")
    }

    return res.status(200).json(new ApiResponse(200,{blogs,length:blogs.length},"popular blogs fetched successfully"))
})

///// write this in the weekend

const getSearchFromOwnBlogsController=asyncHandler(async(req,res)=>{
    const item=req.query.q;
    console.log(item)
    if(!item){
        throw new ApiError(400,"Items are not found in Search Bar")
        
    }

    const id=req.user;

    const blogs = await Blogs.find({
        author: id,
        $or: [
          { title: { $regex: item, $options: "i" } },
          { content: { $regex: item, $options: "i" } }
        ]
      });

    if(!blogs){
        throw new ApiError(400,"blogs not found")
    }

    return res.status(200).json(new ApiResponse(200,{blogs,length:blogs.length},"own blogs fetched successffully"))

})


export {getPopularBLogsController, searchItemController,blogsByCategoriesController,getAllBlogsForUserController,createBlogcontroller,deleteBlogController,updateBlogController,getAllBlogsController,getBlogsByPageController,getRecentBlogsController,getSingleBlogController,getOwnBlogsController,changeBlogStatusController};