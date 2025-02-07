import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { NextFunction } from "express-serve-static-core";
import { Observations, Patients } from "../data";
import { NotFoundError, RequestValidationError } from "../errors";
import dotenv from 'dotenv';
import { validationResult } from "express-validator";
dotenv.config();

class ObservationController extends BaseController
{
    constructor(controllerName: string) {
        super(controllerName);
    }
    static async search (req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new RequestValidationError(errors.array());
        }
        const { patientId } = req.query;
        console.log(patientId);
        const patientExist = Patients.find(patient => patient.id === patientId);
        if (!patientExist) {
            throw new NotFoundError('Patient Does Not Exist');
        }
        const observations = Observations.filter(observation => observation.subject.reference === `Patient/${patientId}`);
        res.status(200).json({
            status: 200,
            message: 'Patient Observations Found',
            data: observations,
        });
    };
}

export { ObservationController as ObservationCtrl };