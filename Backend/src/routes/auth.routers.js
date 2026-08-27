const express = require("express")
const authController = require("../controller/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");
const router = express.Router();

router.post("/register",authController.registerUserController)
router.post("/login",authController.login)
router.get("/logout",authMiddleware.authLogoutUser,authController.logOut)
router.get("/get-me",authMiddleware.authUser,authController.getMe)
module.exports= router;