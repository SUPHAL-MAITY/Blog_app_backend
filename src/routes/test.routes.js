import { Router } from "express";

import { test } from "../controllers/test.controller.js";





const router=Router()




router.route("/test").get(test)



export default router;