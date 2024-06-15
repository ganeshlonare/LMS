import { Router } from "express";
import { getAllCourses, getLecturesById } from "../controllers/course.controller.js";
import { isUserLoggedIn } from "../middlewares/authMiddleware.js";

const router=Router()

router.route('/')
    .get(getAllCourses)

router.route('/:id')
    .get(isUserLoggedIn,getLecturesById)

export default router