import { Router } from "express";
import { addLectures, createCourse, deleteCourse, getAllCourses, getLecturesById , updateCourse } from "../controllers/course.controller.js";
import { isAuthorized, isUserLoggedIn } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/multerMiddleware.js";

const router=Router()

router.route('/')
    .get(getAllCourses)
    .post(isUserLoggedIn, isAuthorized('ADMIN') , upload.single("thumbnail") , createCourse )

router.route('/:id')
    .get(isUserLoggedIn,getLecturesById)
    .delete(isUserLoggedIn,isAuthorized('ADMIN') , deleteCourse)
    .put(isUserLoggedIn,isAuthorized('ADMIN'), updateCourse)
    .post(isUserLoggedIn , isAuthorized('ADMIN'),upload.single("lecture"),addLectures)

export default router