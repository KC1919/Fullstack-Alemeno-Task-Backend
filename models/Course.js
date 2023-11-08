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
        type: [String],
        default: null
    },
    syllabus: [{
        week: String,
        topic: String,
        content: String
    }],
    enrollCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

courseSchema.index({
    name: 'text',
    description: 'text',
    duration: 'text',
    instructor: 'text',
    enrollment: 'text'
});

const Course = mongoose.model('course', courseSchema);

module.exports = Course;