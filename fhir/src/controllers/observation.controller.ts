import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { NextFunction } from "express-serve-static-core";
import { Observations, Patients } from "../data";
import { BadRequestError, ErrorBase, NotFoundError, RequestValidationError } from "../errors";
import dotenv from 'dotenv';
import { validationResult } from "express-validator";
import { Observation, ObservationAttribute, Patient } from "../models";
import { EResourceType } from "../data/enums";
dotenv.config();

class ObservationController extends BaseController
{
    constructor(controllerName: string) {
        super(controllerName);
    }

    static async create(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new RequestValidationError(errors.array());
        }
        const attr = req.body as ObservationAttribute;
        try {
            // check if patient with nhs or emis number exists  
            const patientModel = await Patient.findOne({
                identifier: {
                    $elemMatch: {
                        label: attr.patientIdentity.label,
                        value: attr.patientIdentity.value
                    }
                }
            });
            if (!patientModel) {
                throw new BadRequestError(`Patient with ${attr.patientIdentity.label} identifier does not exist`);
            }
            // update subject reference id in observation attribute
            const observation = Observation.build({
                subject: {
                    reference: `${EResourceType.Patient}/${patientModel.id}`
                },
                code: attr.code,
                patientIdentity: attr.patientIdentity,
                valueQuantity: attr.valueQuantity,
                comment: attr.comment,
            });
            await observation.save();
            res.status(201).json({
                status: 201,
                message: 'Observation created successfully',
                data: observation
            });
        } catch (error: any) {
            throw new BadRequestError(error.message);
        }
    }

    static async search (req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new RequestValidationError(errors.array());
        }
        const { patientId } = req.query;
        
        if (process.env.USE_MONGO !== 'true') {
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
        }

        try {
            const patientExist = await Patient.findById(patientId);
            if (!patientExist) {
                throw new NotFoundError('Patient Does Not Exist');
            }
            const observationModels = await Observation.find({ 
                subject: {
                    reference: `${EResourceType.Patient}/${patientExist.id}`
                }
            });
            if (observationModels.length <= 0) {
                throw new NotFoundError('No Observation found matching the criteria')
            }
            res.status(200).json({
                status: 200,
                message: 'Patient Observations Found',
                data: observationModels,
            });
        } catch (error: any) {
            if (error instanceof NotFoundError) {
                throw new NotFoundError(error.message);
            }
            throw new BadRequestError(error.message);
        }
    };
}

export { ObservationController as ObservationCtrl };