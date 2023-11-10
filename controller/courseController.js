const Course = require('../models/Course');
const NodeCache = require('node-cache');
const myCache = new NodeCache();

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

        let courses;

        if (myCache.has(`${skipCount}-${limit}`)) {
            courses = myCache.get(`${skipCount}-${limit}`);
            return res.status(200).json({
                "success": true,
                "courses": JSON.parse(courses)
            })
        } else {
            courses = await Course.find({}).skip(skipCount).limit(limit);

            if (courses !== null) {
                myCache.set(`${skipCount}-${limit}`, JSON.stringify(courses));
                return res.status(200).json({
                    "success": true,
                    "courses": courses
                })
            } else {
                return res.status(400).json({
                    message: "Course not found!",
                    success: false
                });
            }
        }


    } catch (error) {
        return res.status(500).json({
            message: "Course not found, internal server error",
            success: false,
            error: error.message
        });
    }
}

module.exports.getCourseDetails = async (req, res) => {
    try {
        const cid = req.params.id;

        let course;

        if (myCache.has(cid)) {
            course = myCache.get(cid);
            return res.status(200).json({
                "success": true,
                "course": JSON.parse(course)
            })
        } else {
            course = await Course.findOne({
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
                myCache.set(cid, JSON.stringify(course));
                return res.status(200).json({
                    "success": true,
                    "course": course
                });
            } else {
                return res.status(400).json({
                    message: "Course not found!",
                    success: false
                });
            }
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

        let courses;

        if (myCache.has(`${searchTerm}-${filter}`)) {
            courses = myCache.get(`${searchTerm}-${filter}`);
            return res.status(200).json({
                courses: JSON.parse(courses),
                success: true
            })
        } else {
            courses = await Course.find({
                $text: {
                    $search: searchTerm,
                    $search: filter,
                    $diacriticSensitive: true
                }
            });
            // console.log(courses);

            myCache.set(`${searchTerm}-${filter}`, JSON.stringify(courses));

            return res.status(200).json({
                courses: courses,
                success: true
            })

        }
    } catch (error) {
        console.log("Failed to search course, internal server error", error);
        return res.status(500).json({
            message: "Failed to search course, internal server error",
            success: false,
            error: error.message
        })
    }
}