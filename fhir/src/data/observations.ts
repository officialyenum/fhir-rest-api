export const Observations = [
    {
        "resourceType": "Observation",
        "status": "final",
        "id": "1",
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
        "issued": "2015-03-24T00:00:00+00:00",
        "subject": {
          "reference": "Patient/1"
        }
      },
      {
        "resourceType": "Observation",
        "status": "final",
        "id": "2",
        "code": {
          "coding": [
            {
              "system": "http://read.info/ctv3",
              "code": "XaIzR",
              "display": "Type II diabetes mellitus with persistent microalbuminuria"
            }
          ],
          "text": "Type II diabetes mellitus with persistent microalbuminuria"
        },
        "issued": "2020-08-07T00:00:00+00:00",
        "subject": {
          "reference": "Patient/1"
        },
        "comment": "Data entered as CTV3"
      },      
      {
        "resourceType": "Observation",
        "id": "3",
        "code": {
          "coding": [
            {
              "system": "http://read.info/ctv3",
              "code": "XE2pf",
              "display": "Serum vitamin B12 level"
            }
          ],
          "text": "Serum vitamin B12 level"
        },
        "valueQuantity": {
          "value": 950,
          "unit": "ng/L"
        },
        "issued": "2018-05-31T16:01:40+00:00",
        "status": "final",
        "subject": {
          "reference": "Patient/2"
        }
      },
      {
        "resourceType": "Observation",
        "id": "4",
        "code": {
          "coding": [
            {
              "system": "http://read.info/ctv3",
              "code": "E1130",
              "display": "Recurrent major depressive episodes, unspecified"
            }
          ],
          "text": "Recurrent major depressive episodes, unspecified"
        },
        "issued": "2013-08-04T01:00:00+01:00",
        "status": "final",
        "subject": { "reference": "Patient/2" }
      },{
        "resourceType": "Observation",
        "id": "5",
        "code": {
          "coding": [
            {
              "system": "http://read.info/ctv3",
              "code": "X00DR",
              "display": "Stroke of uncertain pathology"
            }
          ],
          "text": "Stroke of uncertain pathology"
        },
        "issued": "2014-03-05T00:00:00+00:00",
        "status": "final",
        "subject": { "reference": "Patient/2" }
      }
      
      
      
]