export interface SessionsPerStationDto {
    StationID: string;
    Operator: string;
    RequestTimestamp: string;
    PeriodFrom: string;
    PeriodTo: string;
    TotalEnergyDelivered: number;
    NumberOfChargingSessions: number;
    NumberOfActivePoints: number;
    SessionsSummaryList: SessionsSummaryList[];
}

interface SessionsSummaryList {
    PointID: number;
    PointSessions: number;
    EnergyDelivered: string;
}