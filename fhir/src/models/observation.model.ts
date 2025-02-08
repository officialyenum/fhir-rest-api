import mongoose, { Schema, Document, Model } from 'mongoose';
import { EObservationStatus, EResourceType, EUnit } from '../data/enums';

interface ObservationAttribute {
    code: {
        coding: { system: string, code: string, display: string }[];
        text: string;
    }
    valueQuantity?: {
        value: number,
        unit: string
    };
    subject: {
        reference: string;
    };
    comment?: String;
    patientIdentity: { label: string, value: string };
}

interface ObservationModel extends Model<ObservationDoc> {
    build(attrs: ObservationAttribute): ObservationDoc;
}

interface ObservationDoc extends Document {
    resourceType: string;
    id: string;
    code: {
        coding: { system: string, code: string, display: string }[];
        text: string;
    }
    valueQuantity?: {
        value: number,
        unit: string
    };
    issued: string;
    status: string;
    subject: {
        reference: string;
    };
    comment?: String;
}

const ObservationSchema: Schema = new Schema({
    resourceType: { 
        type: String, 
        enum: [EResourceType.Observation],
        default: EResourceType.Observation  
    },
    code: {
        coding: [
            { 
                system: { type: String, required: true },
                code: { type: String, required: true },
                display: { type: String, required: true }
            }
        ],
        text: { type: String, required: true },
    },
    valueQuantity: {
        value: { type: Number, default: 0 },
        unit: { type: String, enum: [EUnit], default: EUnit.NG_L },
    },
    issued: { type: Date, default: Date.now() },
    status: { 
        type: String,
        enum: [EObservationStatus],
        default: EObservationStatus.Final,
    },
    subject: {
        reference: { type: String },
    },
    comment: { type: String },
}, {
    toJSON: {
        transform(doc, ret, options) {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
        },
    }
});

ObservationSchema.statics.build = (attrs: ObservationAttribute) => {
    return new Observation({
        code: attrs.code,
        valueQuantity: attrs.valueQuantity,
        subject: attrs.subject,
        comment: attrs.comment,
    })
};

const Observation = mongoose.model<ObservationDoc, ObservationModel>('Observation', ObservationSchema);

export { Observation, ObservationAttribute }