import mongoose, { Schema, Document, Model } from 'mongoose';
import { EGender, EPatientAddressTypes, EPatientIdentifierLabels, EPatientIdentifierSystems, EResourceType, ETelecomSystem } from '../data/enums';

interface PatientAttribute {
    identifier: { label?: string, system: string; value: string }[];
    name: { family: string; given: string[]; text: string }[];
    telecom: { use?: string; system: string; value: string }[];
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

interface PatientModel extends Model<PatientDoc> {
    build(attrs: PatientAttribute): PatientDoc;
}

interface PatientDoc extends Document {
    resourceType: string;
    id: string;
    identifier: { system: string; value: string }[];
    name: { use?: string, family: string; given: string[]; prefix?: string[]; text: string }[];
    telecom: { use?: string, system: string; value: string }[];
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
    resourceType: { 
        type: String,
        enum: [EResourceType.Patient],
        default: EResourceType.Patient  // default value for system is 'phone' if no value is provided in the request.
    },
    identifier: [
        {
            label: { 
                type: String,
                enum: [EPatientIdentifierLabels],
                default: EPatientIdentifierLabels.NHS_LABEL  // default value for system is 'phone' if no value is provided in the request.
            },
            system: {  type: String, required: true },
            value: { type: String, required: true }
        }
    ],
    name: [
        {
            family: { type: String, required: true },
            given: [ { type: String, required: true } ],
            text: { type: String, required: true }
        }
    ],
    telecom: [
        {
            system: { 
                type: String,
                enum: [ETelecomSystem],
                default: ETelecomSystem.Phone  // default value for system is 'phone' if no value is provided in the request.
            },
            value: { type: String, required: true }
        }
    ],
    gender: { 
        type: String,
        enum: [EGender],
        default: EGender.Unknown  // default value for gender is 'unknown' if no value is provided in the request.
    },
    birthDate: { type: Date, required: true },
    address: [
        {
            use: { 
                type: String,
                enum: [EPatientAddressTypes],
                default: EPatientAddressTypes.Home  // default value for system is 'phone' if no value is provided in the request.
            },
            text: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            postalCode: { type: String, required: true }
        }
    ]
}, {
    toJSON: {
        transform(doc, ret, options) {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
        },
    }
});

PatientSchema.statics.build = (attrs: PatientAttribute) => {
    return new Patient({
        identifier: attrs.identifier,
        name: attrs.name,
        telecom: attrs.telecom,
        gender: attrs.gender,
        birthDate: attrs.birthDate,
        address: attrs.address
    })
};

const Patient = mongoose.model<PatientDoc, PatientModel>('Patient', PatientSchema);


export { Patient, PatientAttribute }