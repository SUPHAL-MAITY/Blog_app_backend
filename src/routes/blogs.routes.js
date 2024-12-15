import { Router } from "express";

import { blogsByCategoriesController, changeBlogStatusController, createBlogcontroller, deleteBlogController, getAllBlogsController, getAllBlogsForUserController, getBlogsByPageController, getOwnBlogsController, getPopularBLogsController, getRecentBlogsController, getSearchFromOwnBlogsController, getSingleBlogController, searchItemController, updateBlogController } from "../controllers/blog.controller.js";
import { decodeToken,isAdmin } from "../middlewares/auth.middleware.js";







const router=Router()




router.route("/create-blog").post(decodeToken,createBlogcontroller)
router.route("/delete-blog/:id").delete(deleteBlogController)
router.route("/update-blog/:id").post(updateBlogController)
router.route("/all-blogs").get(decodeToken,isAdmin,getAllBlogsController)
router.route("/recent").get(getRecentBlogsController)
router.route("/blogs-by-page").get(getBlogsByPageController)
router.route("/single-blog/:id").get(getSingleBlogController)
router.route("/get-own-blogs").get(decodeToken, getOwnBlogsController)
router.route("/change-blog-status").post(changeBlogStatusController)
router.route("/all-user-blogs").get(getAllBlogsForUserController)
router.route("/category/:category").get(blogsByCategoriesController)
router.route("/search").get(searchItemController)
router.route("/popular").get(getPopularBLogsController)
router.route("/get-own-search-blogs").get(decodeToken ,getSearchFromOwnBlogsController)




export default router;