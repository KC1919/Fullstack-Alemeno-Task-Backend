const express = require('express');
const router = express.Router();
const studentController = require('../controller/studentController');
const verify = require('../middlewares/verify');

router
    .post('/enroll', studentController.enrollStudent)
    .get('/enrolledCourses', studentController.getEnrolledCourses)
    .put('/updateStatus', studentController.markCourseCompleted)
    .post('/courseDetails', studentController.getFullCourseDetails)

module.exports = router;