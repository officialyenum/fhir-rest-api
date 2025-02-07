
import { ValidationError } from "express-validator";
import { ErrorBase } from "./error-base.error";

export class NotFoundError extends ErrorBase {
    statusCode = 404;
    constructor(public reason: string) {
        super(reason);

        Object.setPrototypeOf(this, NotFoundError.prototype);
    }

    serializeErrors() {
        return [ {  message: this.reason } ];
    }
};