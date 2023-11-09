const mongoose = require('mongoose');

const connectDb = () => {
    try {
        const conn = mongoose.connect('mongodb://0.0.0.0:27017/Alemeno-task-db');

        if (conn != undefined) {
            console.log("Database connected successfuly!");
        }
    } catch (error) {
        console.log("Database connection failed", error);
    }
}

module.exports = connectDb;