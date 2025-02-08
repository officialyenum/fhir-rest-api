import { validationResult } from "express-validator";
import { BaseController } from "./base.controller";
import { BadRequestError, NotFoundError, RequestValidationError } from "../errors";
import { Request, Response } from "express";
import { EPatientIdentifierLabels, EPatientIdentifierSystems } from "../data/enums";
import { Patients } from "../data";
import { Patient, PatientAttribute } from "../models";
import dotenv from 'dotenv';
import { Error } from "mongoose";
dotenv.config();

interface FilterParam {
    // Add filter parameters as needed
}
class PatientController extends BaseController
{
    constructor(controllerName: string) {
        super(controllerName);
    }
    static async create(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new RequestValidationError(errors.array());
        }
        const attr = req.body as PatientAttribute;
        // check if patient with nhs number exists  
        
        let nhsNumber;
        for (let i = 0; i < Patients.length; i++) {
            if (attr.identifier[i].label === EPatientIdentifierLabels.NHS_LABEL) {
                nhsNumber = attr.identifier[i].value;
                break;
            }
        }
        const patientModels = await Patient.find({
            identifier: {
                $elemMatch: {
                    label: EPatientIdentifierLabels.NHS_LABEL,
                    value: nhsNumber
                }
            }
        });
        if (patientModels.length > 0) {
            throw new BadRequestError("Patient with NHS identifier already exists");
        }
        try {
            const patient = Patient.build(attr);
            await patient.save();
            res.status(201).json({
                status: 201,
                message: 'Patient created successfully',
                data: patient
            });
        } catch (error: any) {
            throw new BadRequestError(error.message);
        }
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
                        id.label === EPatientIdentifierLabels.NHS_LABEL &&
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
                    label: EPatientIdentifierLabels.NHS_LABEL,
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

        
        const patientModels = await Patient.find(query);
        if (patientModels.length === 0) {
            throw new NotFoundError('No patients found matching the criteria')
        }
        res.json({
            status: 200,
            message: 'Patients retrieved successfully',
            data: patientModels
        });
    }
}


export { PatientController as PatientCtrl };