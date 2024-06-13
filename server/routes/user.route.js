import express , {Router} from 'express'
import { register , login , logout , getProfile } from '../controllers/user.controller.js'
import { isUserLoggedIn } from '../middlewares/authMiddleware.js'
import upload from '../middlewares/multerMiddleware.js'

const router=Router()

router.post("/register",upload.single("avatar"),register)
router.post("/login",login)
router.get("/logout",logout)
router.post("/me",isUserLoggedIn,getProfile)

export default router