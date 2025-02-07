import request from "supertest";
import { app } from "../../app";

it("returns 200 if Queries are Correct and Patient(s) Found", async () => {
    const response = await request(app).post('/api/fhir/Patient/_search').query({ nhsNumber: '1111111111', surname: 'Smith' });
    expect(response.status).toEqual(200);
    expect(response.body.message).toEqual('Patients retrieved successfully');
});

it("returns 200 if nhsNumber query is specified and Patient(s) Found", async () => {
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