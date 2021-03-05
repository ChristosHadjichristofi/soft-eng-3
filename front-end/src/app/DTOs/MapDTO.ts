export interface StationsDto {
    RequestTimestamp: Date;
    StationsList: StationsList[];
}

interface StationsList {
    StationID: number;
    StationName: string;
    Latitude: number;
    Longitude: number;
}



export interface NearestStationsDto {
    RequestTimestamp: Date;
    StationsList: NearestStationsList[];
}

interface NearestStationsList {
    StationID: number;
    StationName: string;
    Latitude: number;
    Longitude: number;
    Distance: number;
}



