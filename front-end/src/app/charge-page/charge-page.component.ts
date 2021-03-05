import { HttpClient, HttpHeaders } from '@angular/common/http';
import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit, ɵbypassSanitizationTrustScript } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Services } from '../providers/services';

@Component({
  selector: 'app-charge-page',
  templateUrl: './charge-page.component.html',
  styleUrls: ['./charge-page.component.scss']
})
export class ChargePageComponent implements OnInit {

  form: FormGroup;
  UserVehicles = [];
  Stations = [];
  Points = [];
  Protocols = [];
  ConnectionTime: string;
  DisconnectionTime: string;
  KWhDelivered: string;

  constructor(private formBuilder: FormBuilder, public http: HttpClient, public services: Services, private router: Router) {
    this.form = this.formBuilder.group({
      UserVehicles: [''],
      Stations: [''],
      Points: [''],
      Protocols: [''],
      ConnectionTime: '',
      DisconnectionTime: '',
      KWhDelivered: ''
    });

    // show user vehicles on form
    this.getUserVehicles();
    // show stations on form
    this.getStations();
    // patch value for protocol on form (preselected Normal)
    this.form.controls.Protocols.patchValue('normal(20kW)');
  }

  LicencePlateSelected(event) {
    console.log(this.form.controls.UserVehicles.value);
    console.log('value', this.form.value);
  }

  // api call to get user vehicles and patch value on form (preselected the first plates)
  getUserVehicles() {
    
    this.http.get<{ LicensePlateList: { license_plate: string }[] }>('http://localhost:8765/evcharge/api/charge/licenseplates/' + this.services.getOwnerID(), { headers: this.services.getAuthHeaders() }).subscribe(result => {
      this.UserVehicles = result.LicensePlateList;
      this.form.controls.UserVehicles.patchValue(this.UserVehicles[0].license_plate);
    });
  }

  // api call to get stations and patch value on form (preselected the first station)
  getStations() {
    
    this.http.get<{ StationList: { station_id: string, station_name: string }[] }>('http://localhost:8765/evcharge/api/charge/stations', { headers: this.services.getAuthHeaders() }).subscribe(result => {
      this.Stations = result.StationList;
      this.form.controls.Stations.patchValue(this.Stations[0].station_id.toString());
      // when stationsList returned, need to make an api call to get Points of the preselected value
      this.getPoints(this.Stations[0].station_id);
    });
  }

  // api call to get points and patch value on form (preselected the first point)
  getPoints(stationID: string) {
    
    this.http.get<{ PointList: { point_id: string }[] }>('http://localhost:8765/evcharge/api/charge/points/' + stationID, { headers: this.services.getAuthHeaders() }).subscribe(result => {
      this.Points = result.PointList;
      this.form.controls.Points.patchValue(this.Points[0].point_id.toString());
    });
  }

  StationSelected(event) {
    this.getPoints(this.form.controls.Stations.value);
  }

  PointSelected(event) {
    console.log(this.form.controls.Points.value);
  }

  ProtocolSelected(event) {
    console.log(this.form.controls.Protocols.value);
    console.log('value', this.form.value);
  }

  ConnectionTimeSelected(event) {
    console.log(this.form.controls.ConnectionTime.value);
    console.log('value', this.form.value);
  }

  DisconnectionTimeSelected(event) {
    console.log(this.form.controls.DisconnectionTime.value);
    console.log('value', this.form.value);
  }

  KWhDeliveredSelected(event) {
    console.log(this.form.controls.KWhDelivered.value);
    console.log('value', this.form.value);
  }

  proceedToPayment() {
    localStorage.setItem("SessionData", this.services.encrypt(JSON.stringify(this.form.value)));

    this.router.navigateByUrl('/payment');
  }

  ngOnInit(): void {

  }

}
