export interface SessionsPerProviderDto {
    ProviderID: string;
    ProviderName: string;
    RequestTimestamp: string;
    PeriodFrom: string;
    PeriodTo: string;
    NumberOfProviderChargingSessions: number;
    TotalCost: number;
    ProviderChargingSessionsList: ProviderChargingSessionsList[];
}

interface ProviderChargingSessionsList {
    SessionIndex: number;
    StationID: number;
    SessionID: number;
    VehicleID: string;
    StartedOn: string;
    FinishedOn: string;
    ΕnergyDelivered: string;
    PricePolicyRef: string;
    CostPerKWh: string;
    sessionCost: string;
}