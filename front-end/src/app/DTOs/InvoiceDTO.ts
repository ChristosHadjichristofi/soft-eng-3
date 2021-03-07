export interface OwnerTotalsDto {
    total_energy_consumed: number;
    total_cost: number;
}


export interface OwnerListDto {
    chargeslist: OwnerArray[];
}

interface OwnerArray {
    license_number: string;
    connection_time: Date;
    disconnection_time: Date;
    station_name: string;
    point_id: number;
    charging_protocol: string;
    KWh_delivered: number;
    cost_per_KWh: number;
    cost: number;
}


