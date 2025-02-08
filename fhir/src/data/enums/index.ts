
export enum EGender {
    Male = 'male',
    Female = 'female',
    Other = 'other',
    Unknown = 'unknown'
}

export enum EUnit {
    NG_L = "ng/L",
    MG = "mg"
}

export enum ETelecomSystem {
    Phone = "phone",
    Email = "email",
}

export enum ETelecomUse {
    Home = "home",
    Work = "Work",
    Mobile = "mobile",
}

export enum EObservationStatus {
    Final = 'final',
    Amended = 'amended',
    Cancelled = 'cancelled',
}

export enum EResourceType {
    Patient = 'Patient',
    Observation = 'Observation'

}

export enum EPatientIdentifierLabels {
    NHS_LABEL = 'NHS',
    EMIS_LABEL = 'EMIS',
}

export enum EPatientAddressTypes {
    Home = 'home',
    Work = 'work',
    Temp = 'temp',
    Old = 'old',
}

export enum EPatientIdentifierSystems {
    NHS_SYSTEM = 'https://fhir.nhs.uk/Id/nhs-number',
    EMS_SYSTEM = 'http://www.e-mis.com/emisopen/MedicalRecord/PatientID',
}