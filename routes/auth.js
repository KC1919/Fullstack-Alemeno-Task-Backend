const express = require('express');
const authController = require('../controller/authController');
const verify = require('../middlewares/verify');
const router = express.Router();

router
    .post('/login', authController.login)
    .post('/register', authController.register)
    .get('/logout', authController.logout)

module.exports = router;