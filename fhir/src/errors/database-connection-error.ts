
import { ValidationError } from "express-validator";
import { ErrorBase } from "./error-base";

export class DatabaseConnectionError extends ErrorBase {
    statusCode = 500;
    reason = 'Error connecting to the database';
    constructor() {
        super('Database connection error');

        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }

    serializeErrors() {
        return [ {  message: this.reason } ];
    }
};