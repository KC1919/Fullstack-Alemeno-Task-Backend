const Course = require('../models/Course');
const mongoose = require('mongoose');
const errorHandler = require('../utils/errorFunction');

module.exports.addCourse = async (req, res) => {
    try {
        console.log(req.body);

        const course = await Course.findOne({
            name: req.body.name
        });

        if (course !== null) {
            // errorHandler("Course with this name already exists",400,false);
            return res.status(400).json({
                message: "Course with this name already exists",
                success: false
            })
        }

        req.body.preRequisites.forEach(preq => {
            preq = new mongoose.Types.ObjectId(preq);
        });

        await Course.create(req.body);
        res.status(200).json({
            message: "Course added successfully",
            success: true
        });
    } catch (error) {
        console.log("Failed to add course, internal server error", error);
        res.status(500).json({
            message: "Failed to add course",
            success: false
        });
    }
}

module.exports.getCourseList = async (req, res) => {
    try {
        const courses = await Course.find({});

        if (courses !== null) {
            return res.status(200).json(courses)
        } else {
            return res.status(400).json({
                message: "Course not found!",
                success: false
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Course not found, internal server error",
            success: false
        });
    }
}

module.exports.getCourseDetails = async (req, res) => {
    try {
        const cid = req.params.id;

        const course = await Course.findOne({
            _id: cid
        }, {
            _id: 0,
            "name": 1,
            "instructor": 1,
            "enrollment": 1,
            "duration": 1,
            "description": 1
        });

        if (course !== null) {
            return res.status(200).json(course)
        } else {
            return res.status(400).json({
                message: "Course not found!",
                success: false
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Course not found, internal server error",
            success: false
        });
    }
}