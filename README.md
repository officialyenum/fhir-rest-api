# FHIR-rest-api

Create a simple RESTful API that provides data when queried (preferably javascript/typescript)

## Requirements

User story: as a nurse practitioner I want to be able to view a list of observations for a patient

- The API should be able to retrieve patient(s) using NHS number or surname
- The API should be able to retrieve all observations for a patient ID

**Notes**

- Sample data included are [FHIR](http://hl7.org/fhir/) resources (a standard for health care data exchange)
  - [Patient](http://www.hl7.org/implement/standards/fhir/patient.html)
  - [Observation](http://www.hl7.org/implement/standards/fhir/observation.html)
- Ideally requests should follow FHIR [Search](http://hl7.org/fhir/http.html#search) requirements and the response should be a FHIR [Bundle](http://hl7.org/fhir/bundle.html) resource, but this is not a requirement of this task
- The `subject` property in the Observation resource is a reference to the Patient resource `id`
- Acceptance testing could be via Postman, simple curl commands or any approach that suits you.
- Please complete this task to the standard that you set for real work destined for a production environment.
- Share the code however is easiest for you (zip file, link to a repo, etc)

---
# **SOLUTION**
---

## **FHIR REST API Solution**

A simple RESTful API built to serve FHIR (Fast Healthcare Interoperability Resources) data, following the standard for health care data exchange. The API allows for patient and observation retrieval and is designed with scalability and clean architecture in mind.

---

## **API Requirements & Implementation**

1. **Retrieve Patient(s)**  
   - Search using **NHS number** or **surname**.
   - Endpoint:  
     `POST http://localhost:3000/api/fhir/Patient/_search?nhsNumber=1111111111`  
     `POST http://localhost:3000/api/fhir/Patient/_search?surname=Smith`  
     `POST http://localhost:3000/api/fhir/Patient/_search?nhsNumber=1111111111&surname=Smith`

2. **Retrieve Observations for a Patient**  
   - Search using **patient ID**.
   - Endpoint:  
     `GET http://localhost:3000/api/fhir/Observation/_search?patientId=1`

3. **Create New Patient (for Testing)**  
   - Endpoint:  
     `POST http://localhost:3000/api/fhir/Patient`

4. **Create New Observation (for Testing)**  
   - Endpoint:  
     `POST http://localhost:3000/api/fhir/Observation`

---

## **Technical Approach**

### **Environment Configuration**

- An `.env.example` file is provided to support both in-memory testing and MongoDB seeded data.
- Enable or disable MongoDB seeding by setting `NODE_ENV=testing` in your `.env` file.

### **Project Setup**

1. **Run with Docker (Recommended)**  
   - Build and start the project using:
     ```bash
     docker-compose up --build
     ```
     or simply:
     ```bash
     docker-compose up
     ```

2. **Run Locally (Without Docker)**  
   - Install dependencies:
    ```bash
     cd fhir
    ```
    ```bash
     npm install
    ```
   - Start the server:
    ```bash
     npm run start
    ```

---

## **Features & Best Practices**

- **Error Handling:**  
  Custom error handling is implemented using abstraction to ensure consistent error responses across all endpoints.

- **Data Seeding:**  
  A seeder is provided for quick population of MongoDB with sample data, making testing more efficient.

- **Testing:**  
  - 28 tests covering both in-memory and MongoDB data.
  - Run tests using:
    ```bash
     cd fhir
    ```
    ```bash
    npm run test
    ```

- **Postman Collection:**  
  A **Postman collection** is provided (`FHIR-REST-API/FHIR-API.postman_collection.json`) for easy API testing.

- **Serverless Playground**  
  A **Serverless** approach is provided at [Serverless](https://github.com/officialyenum/fhir-rest-api/tree/serverless) please note this was not tested with the aws infrastructure its just showcasing how it can be implemented as well.

---

## **Key Notes**

- **FHIR Standards:**  
  The API loosely follows FHIR [Search](http://hl7.org/fhir/http.html#search) requirements, and responses are structured to resemble FHIR [Bundle](http://hl7.org/fhir/bundle.html) resources, though strict compliance was not required.
  
- **Acceptance Testing:**  
  The API has been tested using Postman, Jest, and simple curl commands. It is built to reflect production-level standards.

---

## **Endpoints Summary**

| **Endpoint**                                                  | **Description**                             | **Method** |
|---------------------------------------------------------------|---------------------------------------------|------------|
| `/api/fhir/Patient/_search?nhsNumber=1111111111`              | Retrieve patients by NHS number             | POST       |
| `/api/fhir/Patient/_search?surname=Smith`                     | Retrieve patients by surname                | POST       |
| `/api/fhir/Patient/_search?surname=Smith&nhsNumber=1111111111`| Retrieve patients by surname and NHS number | POST       |
| `/api/fhir/Observation/_search?patientId=1`                   | Retrieve observations by patient ID         | GET        |
| `/api/fhir/Patient`                                           | Create a new patient (for testing)          | POST       |
| `/api/fhir/Observation`                                       | Create a new observation (for testing)      | POST       |
|---------------------------------------------------------------|---------------------------------------------|------------|

---

## **Wakatime Stats**

[Wakatime Stats](https://wakatime.com/@officialyenum/projects/fbqzwsiwsq?start=2025-02-02&end=2025-02-08)

## **Conclusion**

This API is designed to meet the specified requirements for patient and observation retrieval, while adhering to best practices in RESTful API development. Error handling, data seeding, and comprehensive testing have been incorporated to ensure robustness and reliability.

I look forward to your feedback!

---

Let me know if you'd like to adjust anything further! 😊
