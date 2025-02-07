import { validationResult } from "express-validator";
import { BaseController } from "./base.controller";
import { NotFoundError, RequestValidationError } from "../errors";
import { Request, Response } from "express";
import { EPatientIdentifierLabels, EPatientIdentifierSystems } from "../data/enums";
import { Patients } from "../data";
import patientModel from "../models/patient.model";
import dotenv from 'dotenv';
import { IPatientInterface } from "../data/interfaces";
dotenv.config();

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

        if (process.env.USE_MONGO !== 'true') {
            const patientsData = Patients.filter(patient => {
                let matchesNhsNumber = true;
                let matchesSurname = true;
        
                // Check for NHS Number
                if (nhsNumber) {
                    matchesNhsNumber = patient.identifier.some(id => 
                        id.system === 'https://fhir.nhs.uk/Id/nhs-number' &&
                        id.value.includes(nhsNumber as string)  // Partial match allowed
                    );
                }
        
                // Check for Surname
                if (surname) {
                    const surnameQuery = surname as string;
                    matchesSurname = patient.name.some(name =>
                        name.family.toLowerCase().includes(surnameQuery.toLowerCase())
                    );
                }
        
                // Return patient if it matches all provided criteria
                return matchesNhsNumber && matchesSurname;
            });
            if (patientsData.length === 0) {
                throw new NotFoundError('No patients found matching the criteria')
            }
    
            res.json({
                status: 200,
                message: 'Patients retrieved successfully',
                data: patientsData
            });
        }
        // Build dynamic query
        const query: any = {};
        if (nhsNumber) {
            query['identifier'] = {
                $elemMatch: {
                    system: EPatientIdentifierSystems.NHS_SYSTEM,
                    value: { $regex: nhsNumber, $options: 'i' }  // LIKE Case-insensitive partial match
                }
            };
        }
        
        if (surname) {
            query['name'] = {
                $elemMatch: {
                    family: { $regex: surname, $options: 'i' }  // LIKE Case-insensitive partial search
                }
            };
        }

        
        const patientModels = await patientModel.find(query);
        if (patientModels.length === 0) {
            throw new NotFoundError('No patients found matching the criteria')
        }
        console.log('Using mongo db data', patientModels);
        res.json({
            status: 200,
            message: 'Patients retrieved successfully',
            data: patientModels
        });
    }
}


export { PatientController as PatientCtrl };