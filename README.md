# FHIR-rest-api
 A simple RESTful API that provides data when queried following [FHIR](http://hl7.org/fhir/) resources (a standard for health care data exchange)
 
# Candidate Task

Create a simple RESTful API that provides data when queried (preferably javascript/typescript otherwise your own choice of language is fine)

## Requirements ##

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