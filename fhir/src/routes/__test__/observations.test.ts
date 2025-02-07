import request from "supertest";
import { app } from "../../app";
import { EResourceType } from "../../data/enums";

it("returns 200 if Queries are Correct and Observation(s) Resource Type Found", async () => {
    const response = await request(app).get('/api/fhir/Observation/_search').query({ patientId: '1' });
    expect(response.status).toEqual(200);
    expect(response.body.message).toEqual('Patient Observations Found');
    expect(response.body.data[0].resourceType).toEqual(EResourceType.Observation);
});

it("returns 404 if Queries are Correct and Patient Id does not Exist", async () => {
    const response = await request(app).get('/api/fhir/Observation/_search').query({ patientId: '3' });
    expect(response.status).toEqual(404);
    expect(response.body.errors[0].message).toEqual('Patient Does Not Exist');
});

it("returns 400 if Patient Id Parameter is Not Provided", async () => {
    const response = await request(app).get('/api/fhir/Observation/_search');
    expect(response.status).toEqual(400);
    expect(response.body.errors[0].message).toEqual('Patient Id must be specified');
});