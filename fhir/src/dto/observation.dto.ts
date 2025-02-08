import { body, check, query } from "express-validator";
import { NotFoundError } from "../errors";
import { EObservationStatus, EUnit } from "../data/enums";
import mongoose from "mongoose";

export const searchObservationDT0 = [
        query('patientId')
            .exists().withMessage('Patient Id must be specified')
            .trim()
            .custom((value) => {
                if (process.env.MONGO_USE === 'true' && mongoose.Types.ObjectId.isValid(value) === false) {
                    return false;
                }
                return true;
            }).withMessage('Invalid Patient Id')
            .isString().withMessage('Patient Id must be a String')
];

export const createObservationDT0 = [
    // Validate code object
    body('code')
        .exists().withMessage('code is required')
        .isObject().withMessage('code must be an object'),

    body('code.text')
        .exists().withMessage('code text is required')
        .isString().withMessage('code text must be a string'),

    // Validate coding array inside code
    body('code.coding')
        .exists().withMessage('code coding is required')
        .isArray({ min: 1 }).withMessage('code coding must be a non-empty array'),

    body('code.coding.*.system')
        .exists().withMessage('coding system is required')
        .isString().withMessage('coding system must be a string'),

    body('code.coding.*.code')
        .exists().withMessage('coding code is required')
        .isString().withMessage('coding code must be a string'),

    body('code.coding.*.display')
        .exists().withMessage('coding display is required')
        .isString().withMessage('coding display must be a string'),

    // Validate valueQuantity (optional)
    body('valueQuantity')
        .optional()
        .isObject().withMessage('Quantity must be an object if provided'),

    body('valueQuantity.value')
        .optional()
        .isNumeric().withMessage('Quantity value must be a number'),

    body('valueQuantity.unit')
        .optional()
        .isString().withMessage('Quantity unit must be a string')
        .isIn([EUnit]).withMessage('Quantity unit must be a string be either "ng/L" or "mg"'),

    // Validate comment (optional)
    body('comment')
        .optional()
        .isString().withMessage('comment must be a string if provided'),

    // Validate patientIdentity
    body('patientIdentity')
        .exists().withMessage('patientIdentity is required')
        .isObject().withMessage('patientIdentity must be an object'),

    body('patientIdentity.label')
        .exists().withMessage('patientIdentity.label is required')
        .isString().withMessage('patientIdentity.label must be a string'),

    body('patientIdentity.value')
        .exists().withMessage('patientIdentity.value is required')
        .isString().withMessage('patientIdentity.value must be a string'),
];
