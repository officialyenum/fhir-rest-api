import { query, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { EPatientIdentifierLabels } from '../data';
import { Patient } from '../models';

// Validation logic
const validatePatientQuery = async (params: any) => {
    await query('nhsNumber')
        .optional()
        .trim()
        .isString().withMessage('nhsNumber must be a string') // Corrected message
        .run({ query: params });

    await query('surname')
        .optional()
        .trim()
        .isString().withMessage('surname must be a string')
        .run({ query: params });

    // Custom validator to ensure at least one parameter is provided
    if (!params.nhsNumber && !params.surname) {
        return {
            isEmpty: () => false,
            array: () => [{ msg: 'At least nhsNumber or surname must be provided' }]
        };
    }

    return validationResult({ query: params });
};

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        // Use queryStringParameters for GET requests
        const requestQueryParameters = event.queryStringParameters || {};

        // Perform validation
        const errors = await validatePatientQuery(requestQueryParameters);

        if (!errors.isEmpty()) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'Validation Error',
                    errors: errors.array(),
                }),
            };
        }

        const { nhsNumber, surname } = requestQueryParameters;
        const query: any = {};

        // Build MongoDB query
        if (nhsNumber) {
            query['identifier'] = {
                $elemMatch: {
                    label: EPatientIdentifierLabels.NHS_LABEL,
                    value: { $regex: nhsNumber, $options: 'i' } // Case-insensitive match
                }
            };
        }

        if (surname) {
            query['name'] = {
                $elemMatch: {
                    family: { $regex: surname, $options: 'i' } // Case-insensitive match
                }
            };
        }

        // Fetch patients from MongoDB
        const patientModels = await Patient.find(query);

        if (patientModels.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    errors: [
                        { message: 'No patients found matching the criteria' }
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

    } catch (error: any) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'An error occurred',
                error: error.message
            })
        };
    }
};
