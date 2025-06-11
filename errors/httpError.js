

export class HttpError extends Error {
    constructor(message, status = 500) {
        super(message),
        this.name = this.constructor.name;
        this.status = status;
    }
}

export class BadRequestError extends HttpError {
    constructor(message = "Bad request") {
        super(message, 400);
    }
}

export class NotFoundError extends HttpError { 
    constructor(message = 'Not found'){
        super(message, 404);
    }
} 

export class ForbiddenError extends HttpError { 
    constructor(message = 'Forbidden') {
        super(message, 403)
    }
}

export class ConflictError extends HttpError {
    constructor(message = 'Conflict') {
        super(message, 409);
    }
}
