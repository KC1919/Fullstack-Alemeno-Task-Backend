const express = require('express');
const router = express.Router();
const studentController = require('../controller/studentController');
const verify = require('../middlewares/verify');

router
    .post('/enroll', verify ,studentController.enrollStudent)
    .get('/enrolledCourses', verify, studentController.getEnrolledCourses)
    .put('/updateStatus', verify, studentController.markCourseCompleted)
    .post('/courseDetails', verify, studentController.getFullCourseDetails)

module.exports = router;