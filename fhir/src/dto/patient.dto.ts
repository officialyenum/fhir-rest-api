import { body, check, query } from "express-validator";
import { BadRequestError } from "../errors/bad-request.error";

export const searchPatientDT0 = [
        query('nhsNumber')
            .optional()
            .trim()
            .isString().withMessage('nhsNumber must be a number'),
        query('surname')
            .optional()
            .trim()
            .isString().withMessage('surname must be a string'),
        query().custom(queryParam => {
            if (!queryParam.nhsNumber && !queryParam.surname) {
                throw new BadRequestError('At least nhsNumber or surname must be provided');
            }
            return true;
        })
];