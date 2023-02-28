"use strict"

const express = require("express");
const courseController = require("../controllers/courseController");
const courseRouter = express.Router();
const authMiddleware = require("../middlewares/auth");
const { isAllowedToHandleCoursesById, isAllowedToCreateCourses } = require("../middlewares/accessControls/coursesResource");
courseRouter.use(express.json());

courseRouter
  .route("/api/v1/courses", courseController.index)
  .get(courseController.getAllCourses)
  .post(authMiddleware.isLoggedIn, isAllowedToCreateCourses, courseController.createCourse)
  .put(authMiddleware.isLoggedIn, courseController.updateCourse) //Not supported
  .delete(authMiddleware.isLoggedIn, courseController.deleteCourses); //Not supported

courseRouter
  .route("/api/v1/courses/:courseId")
  .get(courseController.getCourseById)
  .post(authMiddleware.isLoggedIn, courseController.createCourseWithId) //Not supported
  .put(authMiddleware.isLoggedIn, isAllowedToHandleCoursesById("update"), courseController.updateCourseById)
  .delete(authMiddleware.isLoggedIn, isAllowedToHandleCoursesById("delete"), courseController.deleteCourseById);

module.exports = courseRouter;