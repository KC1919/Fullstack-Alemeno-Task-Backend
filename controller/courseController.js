const Course = require('../models/Course');

module.exports.addCourse = async (req, res) => {
    try {

        Course.insertMany(req.body, {
            ordered: false
        }).then(result => {
            if (result != null) {
                res.status(200).json({
                    message: "Course added successfully",
                    success: true
                });
            }
        }).catch(err => {
            console.log("Failed to add course, db error");
            res.status(500).json({
                message: "Failed to add course, db error",
                success: false,
                error: err.message
            });
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

        const {
            page,
            limit
        } = req.query;

        // Pagination

        const skipCount = (page - 1 < 0 ? 0 : page - 1) * limit;

        const courses = await Course.find({}).skip(skipCount).limit(2);

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

module.exports.searchCourse = async (req, res) => {
    try {
        const searchTerm = req.query.search;
        const filter = req.query.filter;

        console.log(searchTerm);
        const courses = await Course.find({
            $text: {
                $search: searchTerm,
                $search: filter,
                $diacriticSensitive: true
            }
        });
        // console.log(courses);

        return res.status(200).json({
            courses: courses,
            success: true
        })

    } catch (error) {
        console.log("Failed to search course, internal server error");
        return res.status(500).json({
            message: "Failed to search course, internal server error",
            success: false,
            error: error.message
        })
    }
}