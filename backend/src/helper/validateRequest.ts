import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import ProjectError from "./error";

const validateRequest: RequestHandler = (req, res, next) => {
    //validation
    try {
        const validationError = validationResult(req);
        if (!validationError.isEmpty()) {
            const err = new ProjectError("Validation failed!");
            err.statusCode = 422;
            err.data = validationError.array();
            throw err;
        }
        //validation end
        next();
    } catch (error) {
        next(error);
    }
}

export { validateRequest }