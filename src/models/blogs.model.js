import mongoose ,{Schema} from "mongoose";



const blogSchema=new Schema({
    title: {
      type: String,
      required: true, // Title is mandatory
      
    },
    content: {
      type: String,
      required: true, // Content is mandatory
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User', 
      required: true, 
    },
    category: {
      type: String,
      enum: ['Tech', 'Lifestyle',"Sports", 'Health', 'Travel', 'Business', 'Food',"Politics"], 
      required: true, 
    },
    tags: {
      type: [String], 
      default: [],
    },
    imageUrl: {
      type: String, 
      default: null,
    },
    status: {
      type: String,
      enum: ['published',"inactive"],
      default: 'inactive',
    },  
  
  },
  {
    timestamps: true, 
  })





export const Blogs=mongoose.model("Blogs",blogSchema)