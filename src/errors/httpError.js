

class HttpError extends Error {
    constructor(message, status = 500) {
        super(message),
        this.name = this.constructor.name;
        this.status = status;
    }
}

class BadRequestError extends HttpError {
    constructor(message = "Bad request") {
        super(message, 400);
    }
}

class NotFoundError extends HttpError { 
    constructor(message = 'Not found'){
        super(message, 404);
    }
} 

class ForbiddenError extends HttpError { 
    constructor(message = 'Forbidden') {
        super(message, 403)
    }
}

class ConflictError extends HttpError {
    constructor(message = 'Conflict') {
        super(message, 409);
    }
}

module.exports = new HttpError, new BadRequestError, new NotFoundError, new ForbiddenError, new ConflictError;