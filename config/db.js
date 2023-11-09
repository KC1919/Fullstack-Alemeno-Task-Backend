const mongoose = require('mongoose');
const db_url='mongodb://0.0.0.0:27017/Alemeno-task-db';
const connectDb = () => {
    try {
        const conn = mongoose.connect(process.env.DB_URI);

        if (conn != undefined) {
            console.log("Database connected successfuly!");
        }
    } catch (error) {
        console.log("Database connection failed", error);
    }
}

module.exports = connectDb;