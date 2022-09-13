const Courses = require("../models/courses");
const Sports = require("../models/sports");
const Races = require("../models/races");

//index
exports.index = ((res, req, next) => {
    res.sendStatus(200);
});

//get all Courses
exports.getAllCourses = ((req,res, next) => {
    Courses.findAll({
      where: req.query,
      include: [
        // { model: Races, attributes: { exclude: [ "created_at", "updated_at" ]}},
        { model: Sports, attributes: { exclude: [ "created_at", "updated_at" ]}},
      ],
    })
      .then(
        (courses) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(courses);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
});

//create a new Course 
exports.createCourse = ((req, res, next) => {
  if(!Object.keys(req.body).length) {
    console.log("empty request", req.body);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.send("Data is missing.");
    return;
  }
    Courses.create(req.body)
      .then(
        (course) => {
          console.log("Course created: ", course);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(course);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
});

//update one Course
exports.updateCourse = ((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /courses");
});

//delete Courses
exports.deleteCourses = (req, res, next) => {
  if (Object.entries(req.query).length == 0) {
    res.statusCode = 403;
    res.end("Delete is not supported on /courses.");
  }
  res.statusCode = 403;
  res.end("Delete is not supported on /courses.");
};

//get one Course by Id
exports.getCourseById = ((req, res, next) => {
    Courses.findByPk(req.params.courseId)
      .then((course) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(course);
      })
      .catch((err) => next(err));
});

//create a course with an Id
exports.createCourseWithId = (req, res, next) => {
  res.statusCode = 403;
  res.end("PUT operation not supported on /courses/:courseId");
};

//update one course by Id 
exports.updateCourseById = (req, res, next) => {
  let courseId = req.params.courseId;

  Courses.findByPk(courseId).then((course) => {
    if (!course) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.send(`No Course with Id ${courseId} found.`);
      return;
    }
    course
      .update(req.body)
      .then(
        (course) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(course);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });
};

//delete a course by Id
exports.deleteCourseById = (req, res, next) => {
  let courseId = req.params.courseId;

  Courses.findByPk(courseId).then((course) => {
    if (!course) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.send(`No Course with Id ${courseId} found.`);
      return;
    }
    course.destroy();
    console.log(`Course with id ${courseId} deleted.`);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.send(`Course with Id ${courseId} deleted.`);
  });
};