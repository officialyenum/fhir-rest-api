
import { ValidationError } from "express-validator";
import { ErrorBase } from "./error-base.error";

export class BadRequestError extends ErrorBase {
    statusCode = 400;
    constructor(public reason: string) {
        super(reason);

        Object.setPrototypeOf(this, BadRequestError.prototype);
    }

    serializeErrors() {
        return [ {  message: this.reason } ];
    }
};