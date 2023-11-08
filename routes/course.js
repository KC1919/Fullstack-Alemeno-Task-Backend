const express = require('express');
const router = express.Router();
const courseController = require('../controller/courseController');
const verify = require('../middlewares/verify');

router
    .post('/addCourse', courseController.addCourse)
    .get('/api/:id', courseController.getCourseDetails)
    .get('/allCourses', courseController.getCourseList)

module.exports = router;