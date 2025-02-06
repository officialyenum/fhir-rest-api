import { validationResult } from "express-validator";
import { BaseController } from "./base.controller";
import { NotFoundError, RequestValidationError } from "../errors";
import { Request, Response } from "express";
import { EPatientIdentifierLabels, EPatientIdentifierSystems } from "../enums";

interface FilterParam {
    // Add filter parameters as needed
}
class PatientController extends BaseController
{
    constructor(controllerName: string) {
        super(controllerName);
    }

    static async filter(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new RequestValidationError(errors.array());
        }
        const { nhsNumber, surname } = req.query;

        // Build dynamic query
        const query: any = {};
        
        if (nhsNumber) {
            query['identifier'] = {
                $elemMatch: {
                    system: EPatientIdentifierSystems.NHS_SYSTEM,
                    value: nhsNumber
                }
            };
        }
        if (surname) {
            query['name'] = {
                $elemMatch: {
                    family: { $regex: surname, $options: 'i' }  // Case-insensitive partial search
                }
            };
        }
        res.json({
            status: 200,
            message: 'Patients retrieved successfully',
            data: query,
        });
        // const patients = await PatientModel.find(query);
        // if (patients.length === 0) {
        //     throw new NotFoundError('No patients found matching the criteria')
        // }

        // res.json({
        //     status: 200,
        //     message: 'Patients retrieved successfully',
        //     data: patients
        // });
    }
}


export { PatientController as PatientCtrl };