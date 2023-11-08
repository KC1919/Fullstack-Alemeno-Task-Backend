const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
        default: "No description"
    },
    instructor: {
        type: String,
        required: true
    },
    enrollment: {
        type: String,
        default: "Open"
    },
    duration: {
        type: String,
        default: "1h"
    },
    schedule: {
        type: String
    },
    preRequisites: {
        type: [mongoose.Schema.Types.ObjectId],
        default: null
    },
    syllabus: {
        type: [String]
    },
    enrollCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Course = mongoose.model('course', courseSchema);

module.exports = Course;