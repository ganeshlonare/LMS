import express , {Router} from 'express'
import { register , login , logout , getProfile } from '../controllers/user.controller.js'
import { isUserLoggedIn } from '../middlewares/authMiddleware.js'

const router=Router()

router.post("/register",register)
router.post("/login",login)
router.get("/logout",logout)
router.post("/me",isUserLoggedIn,getProfile)

export default router