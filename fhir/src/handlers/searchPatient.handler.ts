import { query, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { EPatientIdentifierLabels, EResourceType } from '../data';
import { Patient, Observation } from '../models';

// Define your validation logic
const validatePatientQuery = async (params: any) => {
    await query('nhsNumber')
                .optional()
                .trim()
                .isString().withMessage('nhsNumber must be a number').run({ query: params }),
    await query('surname')
                .optional()
                .trim()
                .isString().withMessage('surname must be a string').run({ query: params }),
    await query().custom(queryParam => {
                if (!queryParam.nhsNumber && !queryParam.surname) {
                    return false;
                }
                return true;
            }).withMessage('At least nhsNumber or surname must be provided')
        .run({ query: params });  // Run validation on the provided query parameters

    return validationResult({ query: params });
};


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    
    try {
        const requestQueryParameters = event.body;
        const parsedQuery = JSON.parse(requestQueryParameters || '');
        const nhsNumber = parsedQuery.nhsNumber;
        const surname = parsedQuery.surname;
        // Perform validation
        const errors = await validatePatientQuery(requestQueryParameters);

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
                    return {
                        statusCode: 404,
                        body: JSON.stringify({
                            errors: [
                                {
                                    message: 'No patients found matching the criteria',
                                }
                            ]

                        })
                    };
                }
                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        message: 'Patients retrieved successfully',
                        data: patientModels
                    })
                };
    } catch (error) {
        return {
            statusCode: 500,
            body: 'An error occurred',
        }
    }
};