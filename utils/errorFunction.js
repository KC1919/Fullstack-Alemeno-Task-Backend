const errorHandler = (message, statusCode, success, error) => {
    try {
        return res.status(statusCode).json({
            "message": message,
            "success": success,
            "error": error
        });
    } catch (error) {
        console.log(message);
        return res.status(statusCode).json({
            "message": message,
            "success": success,
            "error": error.message
        });
    }
}

module.exports = errorHandler;