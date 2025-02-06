import mongoose, { Schema, Document } from 'mongoose';

interface IPatientDoc extends Document {
    resourceType: string;
    id: string;
    identifier: { system: string; value: string }[];
    name: { family: string; given: string[]; text: string }[];
    telecom: { system: string; value: string }[];
    gender: string;
    birthDate: string;
    address: {
        use: string;
        text: string;
        city: string;
        state: string;
        postalCode: string;
    }[];
}

const PatientSchema: Schema = new Schema({
    resourceType: { type: String, required: true },
    id: { type: String, required: true },
    identifier: [
        {
            label: String,
            system: String,
            value: String
        }
    ],
    name: [
        {
            family: String,
            given: [String],
            text: String
        }
    ],
    telecom: [
        {
            system: String,
            value: String
        }
    ],
    gender: { type: String },
    birthDate: { type: String },
    address: [
        {
            use: String,
            text: String,
            city: String,
            state: String,
            postalCode: String
        }
    ]
});

export default mongoose.model<IPatientDoc>('Patient', PatientSchema);
