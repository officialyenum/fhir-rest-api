import { body, validationResult, check } from 'express-validator';
import express, { Request, Response } from 'express';
import { PatientCtrl } from '../controllers';
import { searchPatientDT0 } from '../dto';

const router = express.Router();

// Validation Logic
router.post('/api/fhir/Patient/_search',
    searchPatientDT0,
    PatientCtrl.filter
);

export { router as patientsRouter };
