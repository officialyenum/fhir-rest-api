import { query, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { EResourceType } from '../data';
import { Patient, Observation } from '../models';

// Define your validation logic
const validateObservationQuery = async (params: any) => {
    await query('patientId')
        .exists().withMessage('Patient Id must be specified')
        .trim()
        .custom((value) => {
            if (process.env.MONGO_USE === 'true' && !mongoose.Types.ObjectId.isValid(value)) {
                return false;
            }
            return true;
        }).withMessage('Invalid Patient Id')
        .isString().withMessage('Patient Id must be a String')
        .run({ query: params });  // Run validation on the provided query parameters

    return validationResult({ query: params });
};


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    
    try {
        const requestQueryParameters = event.body;
        const parsedQuery = JSON.parse(requestQueryParameters || '');

        // Perform validation
        const errors = await validateObservationQuery(requestQueryParameters);

        // Handle validation errors
        if (!errors.isEmpty()) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'Validation Error',
                    errors: errors.array(),
                }),
            };
        }
        const patientId = requestQueryParameters;

        const patientExist = await Patient.findById(patientId);
        if (!patientExist) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    message: 'Patient Does Not Exist',
                }),
            }
        }
        const observationModels = await Observation.find({ 
            subject: {
                reference: `${EResourceType.Patient}/${patientExist.id}`
            }
        });
        if (observationModels.length <= 0) {
                return {
                    statusCode: 404,
                    body: JSON.stringify({
                        message: 'No Observation found matching the criteria',
                }),
            }
        }
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Patient Observations Found',
                data: observationModels,
            }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: 'An error occurred',
        }
    }
};