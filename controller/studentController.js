const NodeCache = require('node-cache');
const Course = require('../models/Course');
const Student = require('../models/Student');
const mongoose = require('mongoose');
const myCache = new NodeCache();

module.exports.enrollStudent = async (req, res) => {
    try {

        //converting course id from String to ObjectId
        const cid = new mongoose.Types.ObjectId(req.body.cid);

        //finding the course, with course id
        const course = await Course.findById({
            _id: cid
        });

        //checking whether the course exist or not
        if (course === null) {
            return res.status(400).json({
                message: "Course does not exist",
                success: false
            });
        }

        //checking if student is already enrolled in the course
        const courseCheck = await Student.findOne({
            "_id": req.userId,
            "courses": {
                $elemMatch: {
                    "cid": cid
                }
            }
        });

        //if already enrolled, then return a message to the student
        if (courseCheck !== null) {
            return res.status(400).json({
                message: "Already enrolled",
                success: false
            });
        }

        //otherwise, enroll the student in the requested course
        else {
            Student.updateOne({
                _id: req.userId
            }, {
                $push: {
                    "courses": {
                        "cid": cid
                    }
                }
            }).then(async result => {
                // console.log(result);

                if (result.modifiedCount > 0) {

                    //incrementing the enrollment count in Course collection
                    await Course.findByIdAndUpdate({
                        _id: cid
                    }, {
                        $inc: {
                            "enrollCount": 1
                        }
                    });

                    return res.status(200).json({
                        message: "Enrolled Successfully",
                        success: true
                    })
                } else {
                    return res.status(400).json({
                        message: "Failed to enroll Student",
                        success: false
                    })
                }
            }).catch(err => {
                res.status(500).json({
                    message: "Failed to enroll, db error",
                    success: false,
                    error: err.message
                });
                process.exit(0);
            });
        }

    } catch (error) {
        res.status(500).json({
            message: "Failed to enroll, internal server error",
            success: false,
            error: error.message
        });
        process.exit(0);
    }
}

module.exports.getEnrolledCourses = async (req, res) => {
    try {

        // console.log(req.userId);

        if (myCache.has(req.userId)) {
            let enrollCourses = myCache.get(req.userId);
            return res.status(200).json({
                "enrolledCourses": JSON.parse(enrollCourses),
                success: true
            });
        } else {

            //fetching the id of all the courses student is enroled in
            const data = await Student.findById({
                _id: req.userId
            }, {
                "courses": 1,
                "_id": 0
            });

            let courses = data.courses;

            if (courses.length > 0) {
                let cidArr = [];
                const courseMap = new Map();

                //pushing all the ids in an array
                courses.forEach(course => {
                    cidArr.push(course.cid);
                    courseMap.set(course.cid.toString(), {
                        "progress": course.progress,
                        "dueDate": course.dueDate
                    });
                })

                // fetching all the courses student is enrolled in,
                // from course collection using the course id
                const enrolledCourses = await Course.find({
                    _id: {
                        $in: cidArr
                    }
                });

                if (enrolledCourses == null) {
                    return res.status(400).json({
                        message: "No enrolled courses found!",
                        success: false
                    })
                }

                //combining the required details to be sent back to the user
                enrolledCourses.forEach(course => {
                    let courseDetails = {
                        ...courseMap.get(course._id.toString()),
                        "instructor": course.instructor,
                        "name": course.name
                    }
                    courseMap.set(course._id.toString(), courseDetails);
                })

                //array to store enrolled course details objects
                const enrolledCourseDetails = []

                courseMap.forEach((val, key, map) => {
                    enrolledCourseDetails.push(map.get(key));
                })

                myCache.set(req.userId, JSON.stringify(enrolledCourseDetails));

                return res.status(200).json({
                    "enrolledCourses": enrolledCourseDetails,
                    success: true
                });
            } else {
                return res.status(400).json({
                    message: "Student not enrolled in any course",
                    enrolledCourses: []
                })
            }
        }
    } catch (error) {
        console.log("Failed to fetch enrolled courses, server error", error);
        res.status(500).json({
            message: "Failed to fetch enrolled courses, internal server error",
            success: false,
            error: error.message
        });
        process.exit(0);
    }
}

module.exports.markCourseCompleted = async (req, res) => {
    try {
        const cid = req.body.cid;

        //finding course by id in enrolled courses and updating its status to completed
        //and updating the progress to 100
        await Student.updateOne({
            _id: req.userId,
            "courses": {
                $elemMatch: {
                    "cid": cid
                }
            }
        }, {
            $set: {
                "courses.$.completionStatus": true,
                "courses.$.progress": 100
            }
        }).then(result => {
            if (result.modifiedCount > 0) {
                return res.status(200).json({
                    message: "Course marked as completed",
                    success: true
                })
            } else {
                return res.status(400).json({
                    message: "Failed to mark course as completed",
                    success: false
                })
            }
        })
    } catch (error) {
        console.log("Failed to mark course completed, server error", error);
        res.status(400).json({
            message: "Failed to mark course as completed, internal server error",
            success: false,
            error: error.message
        })
        process.exit(0);
    }
}

module.exports.getFullCourseDetails = async (req, res) => {
    try {
        const cid = req.body.cid;

        let course;

        if (myCache.has(cid)) {
            course = myCache.get(cid);
            return res.status(200).json({
                success: true,
                "course": JSON.parse(course)
            });
        } else {
            course = await Course.findOne({
                _id: cid
            });

            if (course !== null) {
                myCache.set(cid, JSON.stringify(course));
                return res.status(200).json({
                    success: true,
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
        console.log("failed to get full course details, server error", error);
        res.status(500).json({
            message: "Course not found, internal server error",
            success: false
        });
        process.exit(0);
    }
}