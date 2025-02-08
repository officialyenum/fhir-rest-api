import request from "supertest";
import { app } from "../../app";
import { EResourceType } from "../../data/enums";

const createPatient = () => {
    return request(app).post('/api/fhir/Patient').send({
        "identifier": [
            {
                "label": "NHS",
                "system": "https://fhir.nhs.uk/Id/nhs-number",
                "value": "1111111111"
            },
            {
                "label": "EMIS",
                "system": "http://www.e-mis.com/emisopen/MedicalRecord/PatientID",
                "value": "19529"
            }
        ],
        "name": [
            {
                "use": "official",
                "text": "Mr Zahid Smith",
                "family": "Smith",
                "given": ["Zahid"],
                "prefix": ["Mr"]
            }
        ],
        "telecom": [
            {
                "system": "phone",
                "value": "0700 000 0000",
                "use": "mobile"
            }
        ],
        "gender": "male",
        "birthDate": "1946-02-12",
        "address": [
            {
                "use": "home",
                "text": "Ground Floor Flat, 49 Park Court, Felsham, Milton Keynes, Hertfordshire, W6  9JF",
                "city": "Milton Keynes",
                "state": "Hertfordshire",
                "postalCode": "W6  9JF"
            }
        ]
    });
}
const createObservation = () => {
    return request(app).post('/api/fhir/Observation').send({
        "code": {
            "coding": [
                {
                    "system": "http://read.info/readv2",
                    "code": "F26..",
                    "display": "Migraine"
                },
                {
                    "system": "http://snomed.info/sct",
                    "code": "37796009",
                    "display": "Migraine"
                }
            ],
            "text": "Migraine"
        },
        "patientIdentity": { "label": "NHS", "value": "1111111111" }
    });
}

describe("GET /api/fhir/Observation/_search", () => {
    it("returns 200 if Queries are Correct and Observation(s) Resource Type Found", async () => {
        const patient = await createPatient();
        await createObservation();
        const response = await request(app).get('/api/fhir/Observation/_search').query({ patientId: patient.body.data.id });
        expect(response.status).toEqual(200);
        expect(response.body.message).toEqual('Patient Observations Found');
        expect(response.body.data[0].resourceType).toEqual(EResourceType.Observation);
    });
    
    it("returns 404 if Queries are Correct and Patient Id does not Exist", async () => {
        const response = await request(app).get('/api/fhir/Observation/_search').query({ patientId: '67a7a007aa087167c93d5918' });
        expect(response.status).toEqual(404);
        expect(response.body.errors[0].message).toEqual('Patient Does Not Exist');
    });

    it("returns 400 if Queries are Correct and Patient Id is not a Valid Type", async () => {
        const response = await request(app).get('/api/fhir/Observation/_search').query({ patientId: '1' });
        expect(response.status).toEqual(400);
        expect(response.body.errors[0].message).toEqual('Invalid Patient Id');
    });
    
    it("returns 400 if Patient Id Parameter is Not Provided", async () => {
        const response = await request(app).get('/api/fhir/Observation/_search');
        expect(response.status).toEqual(400);
        expect(response.body.errors[0].message).toEqual('Patient Id must be specified');
    });
});

describe("POST /api/fhir/Observation", () => {
    it("returns 201 if Observation is Created", async () => {
        const patient = await createPatient();
        const response = await createObservation();
        expect(response.status).toEqual(201);
        expect(response.body.message).toEqual('Observation created successfully');
        expect(response.body.data.resourceType).toEqual(EResourceType.Observation);
    });
    
    it("returns 400 if Observation Code is Not Provided", async () => {
        const response = await request(app).post('/api/fhir/Observation').send({
            "status": "final",
            "patientIdentity": { "label": "NHS", "value": "1111111111" }
        });
        expect(response.status).toEqual(400);
        expect(response.body.errors[0].message).toEqual('code is required');
        expect(response.body.errors[1].message).toEqual('code must be an object');
        expect(response.body.errors[2].message).toEqual('code text is required');
        expect(response.body.errors[3].message).toEqual('code text must be a string');
        expect(response.body.errors[4].message).toEqual('code coding is required');
        expect(response.body.errors[5].message).toEqual('code coding must be a non-empty array');
    });

    it("returns 400 if Observation Code coding is Not Provided", async () => {
        const response = await request(app).post('/api/fhir/Observation').send({
            "code": {
                "coding": [],
                "text": "Migraine"
            },
            "status": "final",
            "patientIdentity": { "label": "NHS", "value": "1111111111" }
        });
        expect(response.status).toEqual(400);
        expect(response.body.errors[0].message).toEqual('code coding must be a non-empty array');
    });

    it("returns 400 if Observation Code coding is Not Provided", async () => {
        const response = await request(app).post('/api/fhir/Observation').send({
            "code": {
                "coding": [
                    {
                        "system": "http://read.info/readv2",
                        "display": "Migraine"
                    },
                    {
                        "system": "http://snomed.info/sct",
                        "code": "37796009",
                        "display": "Migraine"
                    }
                ],
                "text": "Migraine"
            },
            "status": "final",
            "patientIdentity": { "label": "NHS", "value": "1111111111" }
        });
        expect(response.status).toEqual(400);
        expect(response.body.errors[0].message).toEqual('coding code is required');
        expect(response.body.errors[1].message).toEqual('coding code must be a string');
    });

    it("returns 400 if Patient Identifier is wrong", async () => {
        const patient = await createPatient();
        const response = await request(app).post('/api/fhir/Observation').send({
            "code": {
                "coding": [
                    {
                    "system": "http://read.info/readv2",
                    "code": "F26..",
                    "display": "Migraine"
                    },
                    {
                    "system": "http://snomed.info/sct",
                    "code": "37796009",
                    "display": "Migraine"
                    }
                ],
                "text": "Migraine"
            },
            "patientIdentity": { "label": "NHS", "value": "5555555555" }
        });
        expect(response.status).toEqual(400);
        expect(response.body.errors[0].message).toEqual('Patient with NHS identifier does not exist');
    });
});