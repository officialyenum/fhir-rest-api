import { body, check, query } from "express-validator";
import { NotFoundError } from "../errors";

export const searchObservationDT0 = [
        query('patientId')
            .trim()
            .isString().withMessage('Patient Id must be specified'),
];