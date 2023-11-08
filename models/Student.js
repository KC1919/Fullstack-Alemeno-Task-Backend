const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    },
    courses: [{
        cid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            default: null
        },
        progress: {
            type: Number,
            default: Math.round(Math.random() * 100)
        },
        dueDate: {
            type: Date,
            default: new Date
        },
        completionStatus: {
            type: Boolean,
            default: false
        }
    }]
}, {
    timestamps: true
});

const Student = mongoose.model('student', studentSchema);

module.exports = Student;