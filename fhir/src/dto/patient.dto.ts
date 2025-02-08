import { body, check, query } from "express-validator";
import { BadRequestError } from "../errors/bad-request.error";
import { EGender, EPatientAddressTypes, EPatientIdentifierLabels, ETelecomSystem, ETelecomUse } from "../data/enums";

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

export const createPatientDTO = [
    // Validate identifier array
    body('identifier')
        .isArray({ min: 1 }).withMessage('At least one Identifier entry is required'),
    body('identifier.*.system')
        .notEmpty().withMessage('Identifier system is required')
        .isString().withMessage('Identifier system must be a string')
        .isURL().withMessage('Identifier system must be a valid URL'),
    body('identifier.*.value')
        .notEmpty().withMessage('Identifier value is required')
        .isString().withMessage('Identifier value must be a string'),
    body('identifier.*.label')
        .notEmpty().withMessage('Identifier label is required')
        .isIn([EPatientIdentifierLabels.NHS_LABEL, EPatientIdentifierLabels.EMIS_LABEL,]).withMessage('Identifier label must be a string be either "NHS" or "EMIS"'),

    // Validate name array
    body('name')
        .isArray({ min: 1 }).withMessage('At least one name entry is required'),
    body('name.*.family')
        .notEmpty().withMessage('Family name is required')
        .isString().withMessage('Family name must be a string'),
    body('name.*.given')
        .isArray({ min: 1 }).withMessage('Given names must be an array with at least one entry'),
    body('name.*.given.*')
        .isString().withMessage('Each given name must be a string'),
    body('name.*.text')
        .notEmpty().withMessage('Full name text is required')
        .isString().withMessage('Full name text must be a string'),
    body('name.*.prefix')
        .optional()
        .isArray(),
    body('name.*.prefix.*')
        .isString().withMessage('Each prefix must be a string'),

    // Validate telecom array
    body('telecom')
        .isArray({ min: 1 }).withMessage('At least one Telecom entry is required'),
    body('telecom.*.system')
        .notEmpty().withMessage('Telecom system is required')
        .isString().withMessage('Telecom system must be a string')
        .isIn([ETelecomSystem.Phone, ETelecomSystem.Email,]).withMessage('Telecom system must be either "phone" or "email"'),
    body('telecom.*.value')
        .notEmpty().withMessage('Telecom value is required')
        .isString().withMessage('Telecom value must be a string'),
    body('telecom.*.use')
        .optional()
        .isString().withMessage('Telecom use must be a string')
        .isIn([ETelecomUse.Home, ETelecomUse.Work, ETelecomUse.Mobile]).withMessage('Telecom use must be "home", "work", or "mobile"'),

    // Validate gender
    body('gender')
        .notEmpty().withMessage('Gender is required')
        .isString().withMessage('Gender must be a string')
        .isIn([EGender.Male, EGender.Female, EGender.Other, EGender.Unknown]).withMessage('Gender must be "male", "female", "other", or "unknown"'),

    // Validate birthDate
    body('birthDate')
        .notEmpty().withMessage('Birth date is required')
        .isISO8601().withMessage('Birth date must be a valid date in ISO 8601 format (YYYY-MM-DD)'),

    // Validate address array
    body('address')
        .isArray({ min: 1 }).withMessage('At least one address is required'),
    body('address.*.use')
        .notEmpty().withMessage('Address use is required')
        .isString().withMessage('Address use must be a string')
        .isIn([EPatientAddressTypes.Home, EPatientAddressTypes.Work, EPatientAddressTypes.Temp, EPatientAddressTypes.Old]).withMessage('Address use must be "home", "work", "temp", or "old"'),
    body('address.*.text')
        .notEmpty().withMessage('Full address text is required')
        .isString().withMessage('Full address text must be a string'),
    body('address.*.city')
        .notEmpty().withMessage('City is required')
        .isString().withMessage('City must be a string'),
    body('address.*.state')
        .notEmpty().withMessage('State is required')
        .isString().withMessage('State must be a string'),
    body('address.*.postalCode')
        .notEmpty().withMessage('Postal code is required')
        .isString().withMessage('Postal code must be a string')
        .matches(/^[A-Za-z0-9 ]{3,10}$/).withMessage('Postal code must be alphanumeric and between 3 to 10 characters'),
    body().custom(body => {
        let addressUse = new Set();
        if (body.address && body.address.length > 1) {
            for (let index = 0; index < body.address.length; index++) {
                const element = body.address[index];
                if (addressUse.has(element.use)) {
                    throw new BadRequestError(`All Addresses must have unique uses, found duplicate use: ${element.use}`);
                }
                addressUse.add(element.use);
            }
        }
        return true;
    })
];
