import express from 'express';
import { ObservationCtrl } from '../controllers';
import { searchObservationDT0 } from '../dto/observation.dto';

const router = express.Router();

router.get('/api/fhir/Observation/_search', searchObservationDT0, ObservationCtrl.search)

export { router as observationsRouter };