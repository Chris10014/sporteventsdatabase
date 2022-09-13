"use strict"

const express = require("express");
const courseController = require("../controllers/courseController");
const courseRouter = express.Router();
courseRouter.use(express.json());

courseRouter
  .route("/api/v1/courses", courseController.index)
  .get(courseController.getAllCourses)
  .post(courseController.createCourse)
  .put(courseController.updateCourse)
  .delete(courseController.deleteCourses);

courseRouter
  .route("/api/v1/courses/:courseId")
  .get(courseController.getCourseById)
  .post(courseController.createCourseWithId)
  .put(courseController.updateCourseById)
  .delete(courseController.deleteCourseById);

module.exports = courseRouter;