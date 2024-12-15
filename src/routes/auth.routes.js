import { Router } from "express";
import { checkAuth, loginController, otpSendController, validateOtpController } from "../controllers/auth.controller.js";






const router=Router()





router.route("/send-otp").post(otpSendController)
router.route("/login").post(loginController)
router.route("/verify").post(validateOtpController)
router.route("/check-auth").get(checkAuth)



export default router;

