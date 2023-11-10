const jwt = require('jsonwebtoken');

const verify = async (req, res, next) => {
    try {
        const token = req.cookies['secret'];
        console.log(token);
        const payload = jwt.verify(token, process.env.SECRET_KEY);
        req.userId = payload.userId;
        req.email = payload.email;

        // console.log(req.userId);
        next();
    } catch (error) {
        console.error("Failed to verify user, server error", error)
        return res.status(500).json({
            message: "Failed to verify user, internal server error",
            success: false,
            error: error.message
        })
    }
}

module.exports = verify;