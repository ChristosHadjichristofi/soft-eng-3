export interface SessionsPerEVDto {
  VehicleID: string;
  RequestTimestamp: string;
  PeriodFrom: string;
  PeriodTo: string;
  TotalEnergyConsumed: string;
  NumberOfVisitedPoints: number;
  NumberOfVehicleChargingSessions: number;
  VehicleChargingSessionsList: VehicleChargingSessionsList[];
}

interface VehicleChargingSessionsList {
  SessionIndex: number;
  SessionID: number;
  EnergyProvider: string;
  StartedOn: string;
  FinishedOn: string;
  EnergyDelivered: string;
  PricePolicyRef: string;
  CostPerKWh: string;
  SessionCost: string;
}