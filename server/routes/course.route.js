import { Router } from "express";
import { createCourse, deleteCourse, getAllCourses, getLecturesById } from "../controllers/course.controller.js";
import { isAuthorized, isUserLoggedIn } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/multerMiddleware.js";

const router=Router()

router.route('/')
    .get(getAllCourses)
    .post(isUserLoggedIn, isAuthorized('ADMIN') , upload.single("thumbnail") , createCourse )

router.route('/:id')
    .get(isUserLoggedIn,getLecturesById)
    .delete(isUserLoggedIn,isAuthorized('ADMIN') , deleteCourse)

export default router