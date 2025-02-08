import { body, validationResult, check } from 'express-validator';
import express, { Request, Response } from 'express';
import { PatientCtrl } from '../controllers';
import { createPatientDTO, searchPatientDT0 } from '../dto';

const router = express.Router();

router.post('/api/fhir/Patient',
    createPatientDTO,
    PatientCtrl.create
);

router.post('/api/fhir/Patient/_search',
    searchPatientDT0,
    PatientCtrl.filter
);

export { router as patientsRouter };
