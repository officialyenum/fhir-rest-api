export const Patients = [
    {
        "resourceType": "Patient",
        "id": "1",
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
    },
    {
        "resourceType": "Patient",
        "id": "2",
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
    }
      
      
]