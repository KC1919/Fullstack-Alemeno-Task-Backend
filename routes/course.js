const express = require('express');
const router = express.Router();
const courseController = require('../controller/courseController');
const verify = require('../middlewares/verify');

router
    .post('/addCourse', verify, courseController.addCourse)
    .get('/api/:id', courseController.getCourseDetails)

module.exports = router;