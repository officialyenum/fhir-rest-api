import request from "supertest";
import { app } from "../../app";

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
const createSecondPatient = () => {
    return request(app).post('/api/fhir/Patient').send({
        "identifier": [
            {
                "label": "NHS",
                "system": "https://fhir.nhs.uk/Id/nhs-number",
                "value": "1111111112"
            },
            {
                "label": "EMIS",
                "system": "http://www.e-mis.com/emisopen/MedicalRecord/PatientID",
                "value": "3058"
            }
        ],
        "name": [
            {
                "use": "official",
                "text": "Miss Eileen Smith",
                "family": "Smith",
                "given": ["Eileen"],
                "prefix": ["Miss"]
            }
        ],
        "telecom": [
            { "system": "phone", "value": "05361052321", "use": "home" },
            { "system": "email", "value": "here@email.com" }
        ],
        "gender": "female",
        "birthDate": "2003-02-16",
        "address": [
            {
            "use": "home",
            "text": "71 St. John's Road, Dover, Moselden Height, West Yorkshire, LS29 7LL",
            "city": "Moselden Height",
            "state": "West Yorkshire",
            "postalCode": "LS29 7LL"
            }
        ]
    });
}
describe("POST /api/fhir/Patient/_search by NHS Number or Surname Test Cases", () => {
    it("returns 200 if Queries are Correct and Patient(s) Found", async () => {
        if (process.env.USE_MONGO == 'false') {
            const response = await request(app).post('/api/fhir/Patient/_search').query({ nhsNumber: '1111111111', surname: 'Smith' });
            expect(response.status).toEqual(200);
            expect(response.body.message).toEqual('Patients retrieved successfully');
        } else {
            const patient = await createPatient();
            const response = await request(app).post('/api/fhir/Patient/_search').query({ 
                nhsNumber: patient.body.data.identifier[0].value, 
                surname: patient.body.data.name[0].family 
            });
            expect(response.status).toEqual(200);
            expect(response.body.message).toEqual('Patients retrieved successfully');

        }
        
    });
    
    it("returns 200 if nhsNumber query is specified and Patient(s) Found", async () => {
        await createPatient();
        const response = await request(app).post('/api/fhir/Patient/_search').query({ nhsNumber: '1111111111' });
        expect(response.status).toEqual(200);
        expect(response.body.message).toEqual('Patients retrieved successfully');
    });
    
    it("returns 404 if nhsNumber query is specified and Patient(s) not Found", async () => {
        const response = await request(app).post('/api/fhir/Patient/_search').query({ nhsNumber: '3333333333' });
        expect(response.status).toEqual(404);
        expect(response.body.errors[0].message).toEqual('No patients found matching the criteria');
    });
    
    it("returns 200 if surname query and Patient(s) Found", async () => {
        await createPatient();
        const response = await request(app).post('/api/fhir/Patient/_search').query({ surname: 'Smith' });
        expect(response.status).toEqual(200);
        expect(response.body.message).toEqual('Patients retrieved successfully');
    });
    
    it("returns 404 if surname query is specified and Patient(s) not Found", async () => {
        const response = await request(app).post('/api/fhir/Patient/_search').query({ surname: 'Ron' });
        expect(response.status).toEqual(404);
        expect(response.body.errors[0].message).toEqual('No patients found matching the criteria');
    });
    
    it("returns 400 if no Query is specified", async () => {
        const response = await request(app).post('/api/fhir/Patient/_search');
        expect(response.status).toEqual(400);
        expect(response.body.errors[0].message).toEqual('At least nhsNumber or surname must be provided');
    });
    
    it("returns 404 for invalid routes", async () => {
        const response = await request(app).get('/invalid');
        expect(response.status).toEqual(404);
        expect(response.body.errors[0].message).toEqual('Not Found');
    });
});

describe("POST /api/fhir/Patient Create Patient Test Cases", () => {

    it("returns 201 for valid patient data and returns 400 duplicate identifier NHS entry", async () => {
        const response = await createPatient();
        expect(response.status).toEqual(201);
        expect(response.body.message).toEqual('Patient created successfully');

        const duplicateResponse = await createPatient();
        expect(duplicateResponse.status).toEqual(400);
        expect(duplicateResponse.body.errors[0].message).toEqual('Patient with NHS identifier already exists');

    });

    it("returns 400 for invalid gender", async () => {
        const response = await request(app).post('/api/fhir/Patient').send({
            "identifier": [
                {
                    "label": "NHS",
                    "system": "https://fhir.nhs.uk/Id/nhs-number",
                    "value": "1111111112"
                },
                {
                    "label": "EMIS",
                    "system": "http://www.e-mis.com/emisopen/MedicalRecord/PatientID",
                    "value": "3058"
                }
            ],
            "name": [
                {
                    "text": "Miss Eileen Smith",
                    "family": "Smith",
                    "given": ["Eileen"],
                    "prefix": ["Miss"]
                }
            ],
            "telecom": [
                { "system": "phone", "value": "05361052321", "use": "home" },
                { "system": "email", "value": "here@email.com" }
            ],
            "gender": "cow",
            "birthDate": "2003-02-16",
            "address": [
                {
                "use": "home",
                "text": "71 St. John's Road, Dover, Moselden Height, West Yorkshire, LS29 7LL",
                "city": "Moselden Height",
                "state": "West Yorkshire",
                "postalCode": "LS29 7LL"
                },
                {
                "use": "home",
                "text": "71 St. John's Road, Dover, Moselden Height, West Yorkshire, LS29 7LL",
                "city": "Moselden Height",
                "state": "West Yorkshire",
                "postalCode": "LS29 7LL"
                }
            ]
        });
        expect(response.status).toEqual(400);
        expect(response.body.errors[0].message).toEqual("Gender must be \"male\", \"female\", \"other\", or \"unknown\"");
    });

    it("returns 400 for invalid birthdate", async () => {
        const response = await request(app).post('/api/fhir/Patient').send({
            "identifier": [
                {
                    "label": "NHS",
                    "system": "https://fhir.nhs.uk/Id/nhs-number",
                    "value": "1111111112"
                },
                {
                    "label": "EMIS",
                    "system": "http://www.e-mis.com/emisopen/MedicalRecord/PatientID",
                    "value": "3058"
                }
            ],
            "name": [
                {
                    "text": "Miss Eileen Smith",
                    "family": "Smith",
                    "given": ["Eileen"],
                    "prefix": ["Miss"]
                }
            ],
            "telecom": [
                { "system": "phone", "value": "05361052321", "use": "home" },
                { "system": "email", "value": "here@email.com" }
            ],
            "gender": "male",
            "birthDate": "200-02-16",
            "address": [
                {
                "use": "home",
                "text": "71 St. John's Road, Dover, Moselden Height, West Yorkshire, LS29 7LL",
                "city": "Moselden Height",
                "state": "West Yorkshire",
                "postalCode": "LS29 7LL"
                },
                {
                "use": "home",
                "text": "71 St. John's Road, Dover, Moselden Height, West Yorkshire, LS29 7LL",
                "city": "Moselden Height",
                "state": "West Yorkshire",
                "postalCode": "LS29 7LL"
                }
            ]
        });
        expect(response.status).toEqual(400);
        expect(response.body.errors[0].message).toEqual("Birth date must be a valid date in ISO 8601 format (YYYY-MM-DD)");
    });
    
    // Identifier test cases go here...
    it("returns 400 for missing identifier entry", async () => {
        const response = await request(app).post('/api/fhir/Patient').send({
            "name": [
                {
                    "text": "Miss Eileen Smith",
                    "family": "Smith",
                    "given": ["Eileen"],
                    "prefix": ["Miss"]
                }
            ],
            "gender": "male",
            "birthDate": "2003-02-16",
            "address": [
                {
                "use": "home",
                "text": "71 St. John's Road, Dover, Moselden Height, West Yorkshire, LS29 7LL",
                "city": "Moselden Height",
                "state": "West Yorkshire",
                "postalCode": "LS29 7LL"
                },
            ]
        });
        expect(response.status).toEqual(400);
        expect(response.body.errors[0].message).toEqual("At least one Identifier entry is required");
    });

    it("returns 400 for missing identifier system and or value entry", async () => {
        const response = await request(app).post('/api/fhir/Patient').send({
            "identifier": [
                {
                    "label": "NHS",
                },
            ],
            "name": [
                {
                    "text": "Miss Eileen Smith",
                    "family": "Smith",
                    "given": ["Eileen"],
                    "prefix": ["Miss"]
                }
            ],
            "gender": "male",
            "birthDate": "2003-02-16",
            "address": [
                {
                "use": "home",
                "text": "71 St. John's Road, Dover, Moselden Height, West Yorkshire, LS29 7LL",
                "city": "Moselden Height",
                "state": "West Yorkshire",
                "postalCode": "LS29 7LL"
                },
            ]
        });
        expect(response.status).toEqual(400);
        expect(response.body.errors[0].message).toEqual("Identifier system is required");
        expect(response.body.errors[1].message).toEqual("Identifier system must be a string");
        expect(response.body.errors[2].message).toEqual("Identifier system must be a valid URL");
        expect(response.body.errors[3].message).toEqual("Identifier value is required");
    });

    // Name test cases go here...
    it("returns 400 for missing name entry", async () => {
        const response = await request(app).post('/api/fhir/Patient').send({
            "identifier": [
                {
                    "label": "NHS",
                    "system": "https://fhir.nhs.uk/Id/nhs-number",
                    "value": "1111111112"
                },
                {
                    "label": "EMIS",
                    "system": "http://www.e-mis.com/emisopen/MedicalRecord/PatientID",
                    "value": "3058"
                }
            ],
            "telecom": [
                { "system": "phone", "value": "05361052321", "use": "home" },
                { "system": "email", "value": "here@email.com" }
            ],
            "gender": "male",
            "birthDate": "2003-02-16",
            "address": [
                {
                "use": "home",
                "text": "71 St. John's Road, Dover, Moselden Height, West Yorkshire, LS29 7LL",
                "city": "Moselden Height",
                "state": "West Yorkshire",
                "postalCode": "LS29 7LL"
                },
                {
                "use": "home",
                "text": "71 St. John's Road, Dover, Moselden Height, West Yorkshire, LS29 7LL",
                "city": "Moselden Height",
                "state": "West Yorkshire",
                "postalCode": "LS29 7LL"
                }
            ]
        });
        expect(response.status).toEqual(400);
        expect(response.body.errors[0].message).toEqual("At least one name entry is required");
    });

    it("returns 400 for missing text, family and prefix name entry", async () => {
        const response = await request(app).post('/api/fhir/Patient').send({
            "identifier": [
                {
                    "label": "NHS",
                    "system": "https://fhir.nhs.uk/Id/nhs-number",
                    "value": "1111111112"
                },
                {
                    "label": "EMIS",
                    "system": "http://www.e-mis.com/emisopen/MedicalRecord/PatientID",
                    "value": "3058"
                }
            ],
            "name": [
                {
                    "given": ["Eileen"],
                }
            ],
            "telecom": [
                { "system": "phone", "value": "05361052321", "use": "home" },
                { "system": "email", "value": "here@email.com" }
            ],
            "gender": "male",
            "birthDate": "2003-02-16",
            "address": [
                {
                "use": "home",
                "text": "71 St. John's Road, Dover, Moselden Height, West Yorkshire, LS29 7LL",
                "city": "Moselden Height",
                "state": "West Yorkshire",
                "postalCode": "LS29 7LL"
                },
                {
                "use": "home",
                "text": "71 St. John's Road, Dover, Moselden Height, West Yorkshire, LS29 7LL",
                "city": "Moselden Height",
                "state": "West Yorkshire",
                "postalCode": "LS29 7LL"
                }
            ]
        });
        expect(response.status).toEqual(400);
        expect(response.body.errors[0].message).toEqual("Family name is required");
        expect(response.body.errors[1].message).toEqual("Family name must be a string");
        expect(response.body.errors[2].message).toEqual("Full name text is required");
        expect(response.body.errors[3].message).toEqual("Full name text must be a string");
    });

    it("returns 400 for missing given name entry", async () => {
        const response = await request(app).post('/api/fhir/Patient').send({
            "identifier": [
                {
                    "label": "NHS",
                    "system": "https://fhir.nhs.uk/Id/nhs-number",
                    "value": "1111111112"
                },
                {
                    "label": "EMIS",
                    "system": "http://www.e-mis.com/emisopen/MedicalRecord/PatientID",
                    "value": "3058"
                }
            ],
            "name": [
                {
                    "text": "Miss Eileen Smith",
                    "family": "Smith",
                    "prefix": ["Miss"]
                }
            ],
            "telecom": [
                { "system": "phone", "value": "05361052321", "use": "home" },
                { "system": "email", "value": "here@email.com" }
            ],
            "gender": "male",
            "birthDate": "2003-02-16",
            "address": [
                {
                "use": "home",
                "text": "71 St. John's Road, Dover, Moselden Height, West Yorkshire, LS29 7LL",
                "city": "Moselden Height",
                "state": "West Yorkshire",
                "postalCode": "LS29 7LL"
                },
                {
                "use": "home",
                "text": "71 St. John's Road, Dover, Moselden Height, West Yorkshire, LS29 7LL",
                "city": "Moselden Height",
                "state": "West Yorkshire",
                "postalCode": "LS29 7LL"
                }
            ]
        });
        expect(response.status).toEqual(400);
        expect(response.body.errors[0].message).toEqual("Given names must be an array with at least one entry");
    });

    // Address test cases go here...
    it("returns 400 for Duplicate address use type", async () => {
        const response = await request(app).post('/api/fhir/Patient').send({
            "identifier": [
                {
                    "label": "NHS",
                    "system": "https://fhir.nhs.uk/Id/nhs-number",
                    "value": "1111111112"
                },
                {
                    "label": "EMIS",
                    "system": "http://www.e-mis.com/emisopen/MedicalRecord/PatientID",
                    "value": "3058"
                }
            ],
            "name": [
                {
                    "text": "Miss Eileen Smith",
                    "family": "Smith",
                    "given": ["Eileen"],
                    "prefix": ["Miss"]
                }
            ],
            "telecom": [
                { "system": "phone", "value": "05361052321", "use": "home" },
                { "system": "email", "value": "here@email.com" }
            ],
            "gender": "male",
            "birthDate": "2003-02-16",
            "address": [
                {
                "use": "home",
                "text": "71 St. John's Road, Dover, Moselden Height, West Yorkshire, LS29 7LL",
                "city": "Moselden Height",
                "state": "West Yorkshire",
                "postalCode": "LS29 7LL"
                },
                {
                "use": "home",
                "text": "71 St. John's Road, Dover, Moselden Height, West Yorkshire, LS29 7LL",
                "city": "Moselden Height",
                "state": "West Yorkshire",
                "postalCode": "LS29 7LL"
                }
            ]
        });
        expect(response.status).toEqual(400);
        expect(response.body.errors[0].message).toEqual("All Addresses must have unique uses, found duplicate use: home");
    });

    it("returns 400 for missing address entry", async () => {
        const response = await request(app).post('/api/fhir/Patient').send({});
    });
    // Telecom test cases go here...
    it("returns 400 for missing telecom entry", async () => {
        const response = await request(app).post('/api/fhir/Patient').send({
            "identifier": [
                {
                    "label": "NHS",
                    "system": "https://fhir.nhs.uk/Id/nhs-number",
                    "value": "1111111112"
                },
                {
                    "label": "EMIS",
                    "system": "http://www.e-mis.com/emisopen/MedicalRecord/PatientID",
                    "value": "3058"
                }
            ],
            "name": [
                {
                    "text": "Miss Eileen Smith",
                    "family": "Smith",
                    "given": ["Eileen"],
                    "prefix": ["Miss"]
                }
            ],
            "gender": "male",
            "birthDate": "2003-02-16",
            "address": [
                {
                "use": "home",
                "text": "71 St. John's Road, Dover, Moselden Height, West Yorkshire, LS29 7LL",
                "city": "Moselden Height",
                "state": "West Yorkshire",
                "postalCode": "LS29 7LL"
                },
            ]
        });
        expect(response.status).toEqual(400);
        expect(response.body.errors[0].message).toEqual("At least one Telecom entry is required");
    });

    it("returns 400 for wrong telecom system entry", async () => {
        const response = await request(app).post('/api/fhir/Patient').send({
            "identifier": [
                {
                    "label": "NHS",
                    "system": "https://fhir.nhs.uk/Id/nhs-number",
                    "value": "1111111112"
                },
                {
                    "label": "EMIS",
                    "system": "http://www.e-mis.com/emisopen/MedicalRecord/PatientID",
                    "value": "3058"
                }
            ],
            "name": [
                {
                    "text": "Miss Eileen Smith",
                    "family": "Smith",
                    "given": ["Eileen"],
                    "prefix": ["Miss"]
                }
            ],
            "telecom": [
                { "system": "phone", "value": "05361052321", "use": "kite" },
                { "system": "rock", "value": "here@email.com" }
            ],
            "gender": "male",
            "birthDate": "2003-02-16",
            "address": [
                {
                "use": "home",
                "text": "71 St. John's Road, Dover, Moselden Height, West Yorkshire, LS29 7LL",
                "city": "Moselden Height",
                "state": "West Yorkshire",
                "postalCode": "LS29 7LL"
                },
            ]
        });
        expect(response.status).toEqual(400);
        expect(response.body.errors[0].message).toEqual("Telecom system must be either \"phone\" or \"email\"");
        expect(response.body.errors[1].message).toEqual("Telecom use must be \"home\", \"work\", or \"mobile\"");
    });
});