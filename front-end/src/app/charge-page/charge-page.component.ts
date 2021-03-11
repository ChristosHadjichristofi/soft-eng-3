import { HttpClient} from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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

  get ConnectionTime() { return this.form.get('ConnectionTime'); }
  get DisconnectionTime() { return this.form.get('DisconnectionTime'); }

  constructor(public toastr: ToastrService, public http: HttpClient, public services: Services, private router: Router) {

    if (this.services.getSessionProgress() != "") {
      this.toastr.info("No Session in Progress!");
      this.services.setSessionProgress("");
      this.router.navigateByUrl('/owner');
      return;
    }

    this.form = new FormGroup({
      UserVehicles: new FormControl(this.UserVehicles, Validators.required),
      Stations: new FormControl(this.Stations, Validators.required),
      Points: new FormControl(this.Points, Validators.required),
      Protocols: new FormControl(this.Protocols, Validators.required),
      ConnectionTime: new FormControl("", Validators.required),
      DisconnectionTime: new FormControl("", Validators.required),
    });

    // show user vehicles on form
    this.getUserVehicles();
    // show stations on form
    this.getStations();
    // patch value for protocol on form (preselected Normal)
    this.form.controls.Protocols.patchValue('normal(20kW)');
  }

  LicencePlateSelected(event) { }

  // api call to get user vehicles and patch value on form (preselected the first plates)
  getUserVehicles() {

    this.http.get<{ LicensePlateList: { license_plate: string }[] }>('https://localhost:8765/evcharge/api/charge/licenseplates/' + this.services.getOwnerID(), { headers: this.services.getAuthHeaders() }).subscribe(result => {
      this.UserVehicles = result.LicensePlateList;
      this.form.controls.UserVehicles.patchValue(this.UserVehicles[0].license_plate);
    });
  }

  // api call to get stations and patch value on form (preselected the first station)
  getStations() {

    this.http.get<{ StationList: { station_id: string, station_name: string }[] }>('https://localhost:8765/evcharge/api/charge/stations', { headers: this.services.getAuthHeaders() }).subscribe(result => {
      this.Stations = result.StationList;
      this.form.controls.Stations.patchValue(this.Stations[0].station_id.toString());
      // when stationsList returned, need to make an api call to get Points of the preselected value
      this.getPoints(this.Stations[0].station_id);
    });
  }

  // api call to get points and patch value on form (preselected the first point)
  getPoints(stationID: string) {

    this.http.get<{ PointList: { point_id: string }[] }>('https://localhost:8765/evcharge/api/charge/points/' + stationID, { headers: this.services.getAuthHeaders() }).subscribe(result => {
      this.Points = result.PointList;
      this.form.controls.Points.patchValue(this.Points[0].point_id.toString());
    });
  }

  StationSelected(event) { }

  PointSelected(event) { }

  ProtocolSelected(event) { }

  ConnectionTimeSelected(event) { }

  DisconnectionTimeSelected(event) { }

  proceedToPayment() {
    if (this.form.valid)
    {

      localStorage.setItem("SessionData", this.services.encrypt(JSON.stringify(this.form.value)));
      
      this.services.setSessionProgress("payment");
      
      this.router.navigateByUrl('/payment');
    }
    else this.toastr.error("Form invalid!")

  }

  ngOnInit(): void { }

}
