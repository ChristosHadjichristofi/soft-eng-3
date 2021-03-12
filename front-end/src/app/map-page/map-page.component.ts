import { HttpClient, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { StationsDto } from '../DTOs/MapDTO';
import { NearestStationsDto } from '../DTOs/MapDTO';
import { Services } from '../providers/services';
@Component({
  selector: 'app-map-page',
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.scss']
})
export class MapPageComponent implements OnInit {

  form: FormGroup;

  lat = 37.990832;
  long = 23.7033199;
  stations: StationsDto;
  nearestStations: NearestStationsDto;
  StationNum: number;
  stationNumberList: any;

  get inputCordX() { return this.form.get('inputCordX'); }
  get inputCordY() { return this.form.get('inputCordY'); }
  get inputNum() { return this.form.get('inputNum'); }

  constructor(public toastr: ToastrService, private http: HttpClient, public services: Services) {
    this.form = new FormGroup({
      inputCordX: new FormControl("", Validators.required),
      inputCordY: new FormControl("", Validators.required),
      inputNum: new FormControl(null, Validators.required)
    });
  }

  ngOnInit(): void {
    this.stations = null;

    var url = 'https://localhost:8765/evcharge/api/map/show';

    this.http.get<StationsDto>(url, { headers: this.services.getAuthHeaders() }).subscribe(stations => {
      this.stations = stations;
      this.StationNum = stations.StationsList.length;
      this.stationNumberList = new Array(this.StationNum).fill(0).map((x, i) => i + 1);
    });
  }

  getResults() { (this.form.valid) ? this.FetchData() : this.toastr.error("Form invalid!"); }

  FetchData() {
    this.nearestStations = null;
    var cordX = this.inputCordX;
    var cordY = this.inputCordY;
    var number = this.inputNum;

    var url = 'https://localhost:8765/evcharge/api/map/nearest/' + cordX + '/' + cordY + '?number=' + number;

    this.http.get<NearestStationsDto>(url, { headers: this.services.getAuthHeaders() }).subscribe(nearestStations => {
      this.nearestStations = nearestStations;
    });

  }

  RestoreData() {
    this.nearestStations = null;
  }
}
