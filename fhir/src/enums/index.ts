
export enum EGender {
    Male = 'Male',
    Female = 'Female',
    Other = 'Other'
}

export enum EUnit {
    NG_L = "ng/L"
}

export enum ETelecomSystem {
    Phone = "phone",
    Email = "email",
    Fax = "fax",
    Pager = "pager",
}

export enum ETelecomUse {
    Home = "home",
    Mobile = "mobile",
}

export enum EObservationStatus {
    Final = 'final',
    Cancelled = 'cancelled',
    EnteredInError = 'entered-in-error'
}

export enum EResourceType {
    Patient = 'Patient',
    Observation = 'Observation'

}

export enum EPatientIdentifierLabels {
    NHS_LABEL = 'NHS',
    EMS_LABEL = 'EMS',
}

export enum EPatientIdentifierSystems {
    NHS_SYSTEM = 'https://fhir.nhs.uk/Id/nhs-number',
    EMS_SYSTEM = 'http://www.e-mis.com/emisopen/MedicalRecord/PatientID',
}