import express from 'express';

import { ObservationCtrl } from '../controllers';

const router = express.Router();
const ObservationController = new ObservationCtrl('ObservationController');

router.get('/api/fhir/Observation/_search', ObservationController.search)

export { router as observationsRouter };