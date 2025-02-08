import { Observation, Patient } from "../../models";
import { EResourceType } from "../enums";

const ObservationSeeder = [
        {
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
            "patientIdentity": { "label": "NHS", "value": "1111111111" },
        },
        {
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
            "patientIdentity": { "label": "NHS", "value": "1111111111" },
            "comment": "Data entered as CTV3"
        },      
        {
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
            "patientIdentity": { "label": "NHS", "value": "1111111112" }
        },
        {
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
            "patientIdentity": { "label": "NHS", "value": "1111111112" }
        },
        {
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
            "patientIdentity": { "label": "NHS", "value": "1111111112" }
        }

]

const generateObservationSeedData = async () => {
    // Implement your seed data generation logic here
    for (let i = 0; i < ObservationSeeder.length; i++) {
        const patientModel = await Patient.findOne({
            identifier: {
                $elemMatch: {
                    label: ObservationSeeder[i].patientIdentity.label,
                    value: ObservationSeeder[i].patientIdentity.value,
                }
            }
        });
        if (!patientModel) {
            console.error(`No patient found with identifier: ${ObservationSeeder[i].patientIdentity.label} - ${ObservationSeeder[i].patientIdentity.value}`);
            continue;
        }
        await Observation.build(
            {
                ...ObservationSeeder[i],
                subject: {
                    reference: `${EResourceType.Patient}/${patientModel.id}`,
                }
            }
        )
        .save();
    
    }
}

export { ObservationSeeder, generateObservationSeedData}