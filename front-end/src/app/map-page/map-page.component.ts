import { HttpClient, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { StationsDto } from '../DTOs/MapDTO';
import { NearestStationsDto } from '../DTOs/MapDTO';
import { Services } from '../providers/services';

@Component({
  selector: 'app-map-page',
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.scss']
})
export class MapPageComponent implements OnInit {

  lat = 37.990832;
  long = 23.7033199;
  stations: StationsDto;
  nearestStations: NearestStationsDto;
  inputCordX: number;
  inputCordY: number;
  inputNum= null;
  StationNum: number;
  stationNumberList: any;

  constructor(private http: HttpClient, private services: Services) { 
  }
  
  ngOnInit(): void {
    this.stations = null;
        
    var url = 'http://localhost:8765/evcharge/api/map/show';
    
    this.http.get<StationsDto>(url, { headers: this.services.getAuthHeaders() }).subscribe(stations => {
      this.stations = stations;
      this.StationNum = stations.StationsList.length;
      this.stationNumberList = new Array(this.StationNum).fill(0).map((x,i)=>i+1);
    });
  }


  FetchData() {
    this.nearestStations = null;
    var cordX = this.inputCordX;
    var cordY = this.inputCordY;
    var number = this.inputNum;
    

    

    var url = 'http://localhost:8765/evcharge/api/map/nearest/' + cordX + '/' + cordY + '?number=' + number;
    console.log(url);

    this.http.get<NearestStationsDto>(url, { headers: this.services.getAuthHeaders() }).subscribe(nearestStations => {
      this.nearestStations = nearestStations;
      console.log(this.nearestStations);
    });

  }

  RestoreData(){
    this.nearestStations = null;
  }
  
  

}
