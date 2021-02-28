export interface SessionsPerPointDto {
    Point: string;
    PointOperator: string;
    RequestTimestamp: string;
    PeriodFrom: string;
    PeriodTo: string;
    NumberOfChargingSessions: number;
    ChargingSessionsList: ChargingSessionsList[];
}

interface ChargingSessionsList {
    SessionIndex: number;
    SessionID: number;
    StartedOn: string;
    FinishedOn: string;
    Protocol: string;
    EnergyDelivered: string;
    Payment: string;
    VehicleType: string;
}