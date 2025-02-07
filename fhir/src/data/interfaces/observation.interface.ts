import { EResourceType, EUnit } from "../enums";

export interface IObservationInterface {
    resourceType: EResourceType.Observation;
    status: string;
    id: number;
    code: {
        coding: [{ system: string, code: string, display: string }];
        text: string;
    } 
    valueQuantity?: {
        value: number;
        unit: EUnit;
    },
    issued: string;
    subject: {
        reference: string;
    };
    comment?: string;
}