"use strict"

const express = require("express");
const courseController = require("../controllers/courseController");
const courseRouter = express.Router();
const authMiddleware = require("../middlewares/auth");
courseRouter.use(express.json());

courseRouter
  .route("/api/v1/courses", courseController.index)
  .get(courseController.getAllCourses)
  .post(authMiddleware.isLoggedIn, authMiddleware.hasRole("editor"), courseController.createCourse)
  .put(authMiddleware.isLoggedIn, authMiddleware.hasRole("editor"), courseController.updateCourse) //Not supported
  .delete(authMiddleware.isLoggedIn, authMiddleware.hasRole("editor"), courseController.deleteCourses); //Not supported

courseRouter
  .route("/api/v1/courses/:courseId")
  .get(courseController.getCourseById)
  .post(authMiddleware.isLoggedIn, authMiddleware.hasRole("editor"), courseController.createCourseWithId) //Not supported
  .put(authMiddleware.isLoggedIn, authMiddleware.hasRole("editor"), courseController.updateCourseById)
  .delete(authMiddleware.isLoggedIn, authMiddleware.hasRole("editor"), courseController.deleteCourseById);

module.exports = courseRouter;