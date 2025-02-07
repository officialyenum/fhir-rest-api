import { EGender, EPatientIdentifierLabels, EPatientIdentifierSystems, EResourceType, ETelecomSystem, ETelecomUse } from "../enums";

interface IName {
    use?: string;
    text: string;
    family: string;
    given: string[];
    prefix: string[];
}

interface ITelecom {
    system: ETelecomSystem;
    value: string;
    use?: ETelecomUse;
}

export interface IPatientInterface {
    resourceType: EResourceType.Patient;
    id: string;
    identifier: {
        label?: string;
        system: string;
        value: string;
    }[];
    name: IName[];
    telecom: ITelecom[];
    gender: EGender;
    birthDate: string;
    address: {
        use: string;
        text: string;
        city: string;
        state: string;
        postalCode: string;
    }[];
}

export interface IFilterPatientInterface {
    resourceType: EResourceType.Patient;
    id: string;
    identifier: {
        label?: EPatientIdentifierLabels;
        system: EPatientIdentifierSystems;
    }[];
    name: [
        {
            family: string;
        }
    ];
}