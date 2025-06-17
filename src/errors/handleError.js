function handleError(err) {
    const defaultError = {
        statusCode: 500,
        message: err.message || 'Internal Server Error', 
    };

    if (err.name === 'BadRequestError') {
        return { statusCode: 400, message: err.message };
    }
    if (err.name === 'NotFoundError') {
        return { statusCode: 404, message: err.message };
    }
    if (err.name === 'ForbiddenError') {
        return { statusCode: 403, message: err.message };
    }
    if (err.name === 'ConflictError') {
        return { statusCode: 409, message: err.message };
    }

    return defaultError;
}

module.exports = { handleError };
