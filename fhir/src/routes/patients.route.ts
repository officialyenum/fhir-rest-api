import { body, validationResult, check } from 'express-validator';
import express, { Request, Response } from 'express';
import { PatientCtrl } from '../controllers';

const router = express.Router();

// Validation Logic
router.post('/api/fhir/Patient/_search',
    [
        check('nhsNumber')
            .optional()
            .isString().withMessage('nhsNumber must be a string'),
        check('surname')
            .optional()
            .isString().withMessage('surname must be a string'),
        body().custom(body => {
            if (!body.nhsNumber && !body.surname) {
                throw new Error('At least nhsNumber or surname must be provided');
            }
            return true;
        })
    ],
    PatientCtrl.filter
);

export { router as patientsRouter };
