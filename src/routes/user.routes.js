import { Router } from "express";
import { changeuserRoleController, changeuserStatusController, createUserController, deleteUserController, editUserController, getAdminDetailsController, getAllUsersController, getOwnUserController, searchUserController } from "../controllers/user.controller.js";
import { decodeToken,isAdmin } from "../middlewares/auth.middleware.js";


const router=Router()


router.route("/create-user").post(createUserController)
router.route("/update-user").post(decodeToken, editUserController)
router.route("/delete-user/:id").delete(deleteUserController)
router.route("/getall-user").get(decodeToken,isAdmin,getAllUsersController)
router.route("/change-role").post(changeuserRoleController)
router.route("/get-own-details").get(decodeToken, getOwnUserController)
router.route("/get-all-admin-details").get(decodeToken,isAdmin,getAdminDetailsController)
router.route("/change-status").post(changeuserStatusController)
router.route("/user-search").get(searchUserController)



export default router;
