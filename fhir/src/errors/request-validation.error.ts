import { ValidationError } from "express-validator";
import { ErrorBase } from "./error-base.error";

export class RequestValidationError extends ErrorBase {
    statusCode: number = 400;
    constructor(public errors: ValidationError[]) {
        super('Invalid Request Parameters');
        Object.setPrototypeOf(this, RequestValidationError.prototype);
        this.errors = errors;
    }

    serializeErrors() {
        // Customize error serialization as needed
        return this.errors.map((err) => {
            if (err.type === 'field') {
                return { message: err.msg, field: err.path };
            }
            return { message: err.msg };
        });
    }
};