import {Router} from 'express'
import { register , login , logout , getProfile, forgotPassword, resetPassword, changePassword, updateUser } from '../controllers/user.controller.js'
import { isUserLoggedIn } from '../middlewares/authMiddleware.js'
import upload from '../middlewares/multerMiddleware.js'

const router=Router()

router.post("/register",upload.single("avatar"),register)
router.post("/login",login)
router.get("/logout",logout)
router.post("/me",isUserLoggedIn,getProfile)
router.post("/forgot-password",forgotPassword)
router.post("/reset/:resetToken",resetPassword)
router.post("/change-password",isUserLoggedIn,changePassword)
router.put("/update",isUserLoggedIn,updateUser)

export default router