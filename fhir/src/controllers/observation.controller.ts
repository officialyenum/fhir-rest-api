import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { NextFunction } from "express-serve-static-core";
import { Observations, Patients } from "../data";
import { NotFoundError } from "../errors";
import dotenv from 'dotenv';
dotenv.config();

class ObservationController extends BaseController
{
    constructor(controllerName: string) {
        super(controllerName);
    }
    async search (req: Request, res: Response, next: NextFunction) {
        const { patientId } = req.query;
        console.log(patientId);
        const patientExist = Patients.find(patient => patient.id === patientId);
        if (!patientExist) {
            throw new NotFoundError('Patient not found');
        }
        const observations = Observations.filter(observation => observation.subject.reference === `Patient/${patientId}`);
        res.status(200).json({
            status: 200,
            message: 'FHIR Observations API',
            data: observations,
        });
    };
}

export { ObservationController as ObservationCtrl };