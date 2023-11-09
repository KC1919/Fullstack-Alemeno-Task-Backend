const express = require('express');
const app = new express();
const cookieParser = require('cookie-parser');
const connectDb = require('./config/db.js');
const authRouter = require('./routes/auth');
const courseRouter = require('./routes/course');
const studentRouter = require('./routes/student');
const errorHandler = require('./utils/errorFunction.js');
const PORT = 8000;


require('dotenv').config({
    path: './config/.env'
});

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use('/auth', authRouter);
app.use('/course', courseRouter)
app.use('/student', studentRouter)

app.use(errorHandler);




app.listen(PORT, (err) => {
    connectDb();
    console.log("Server listening on port", PORT);
})