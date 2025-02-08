import express from 'express';
import { ObservationCtrl } from '../controllers';
import { createObservationDT0, searchObservationDT0 } from '../dto/observation.dto';

const router = express.Router();

router.post('/api/fhir/Observation', createObservationDT0, ObservationCtrl.create)
router.get('/api/fhir/Observation/_search', searchObservationDT0, ObservationCtrl.search)

export { router as observationsRouter };