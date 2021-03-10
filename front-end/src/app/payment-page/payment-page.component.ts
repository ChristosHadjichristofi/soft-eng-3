import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Services } from '../providers/services';

interface SessionData {
  ConnectionTime: string;
  DisconnectionTime: string;
  KWhDelivered: string;
  Points: string;
  Protocols: string;
  Stations: string;
  UserVehicles: string;
  cost?: string;
  rating?: string;
  vehicleType?: string;
}

@Component({
  selector: 'app-payment-page',
  templateUrl: './payment-page.component.html',
  styleUrls: ['./payment-page.component.scss']
})
export class PaymentPageComponent implements OnInit {

  sessionData: SessionData;
  costPerkWh: string;
  totalCost: string;
  vehicleType: string;

  constructor(public toastr: ToastrService, public services: Services, public http: HttpClient, private router: Router) {

    if (this.services.getSessionProgress() != "payment") {
      this.toastr.info("No Session in Progress!");
      this.services.setSessionProgress("");
      this.router.navigateByUrl('/owner');
      return;
    }

    this.sessionData = JSON.parse(this.services.decrypt(localStorage.getItem("SessionData")));
    localStorage.removeItem("SessionData");

    let costPerkWhUrl = 'http://localhost:8765/evcharge/api/charge/costperkwh/' + this.sessionData.Points;

    this.http.get<{ costperkwh: string }>(costPerkWhUrl, { headers: this.services.getAuthHeaders() }).subscribe(result => {
      this.costPerkWh = result.costperkwh;

      let costUrl = 'http://localhost:8765/evcharge/api/charge/cost/' + this.sessionData.ConnectionTime
        + '/' + this.sessionData.DisconnectionTime + '/' + this.sessionData.Protocols + '/' + this.costPerkWh

      this.http.get<{ kWhDelivered: string, cost: string }>(costUrl, { headers: this.services.getAuthHeaders() }).subscribe(result => {
        this.totalCost = result.cost;
        this.sessionData.cost = this.totalCost;
        this.sessionData.KWhDelivered = result.kWhDelivered;
      });
    });

    let vehicleTypeUrl = 'http://localhost:8765/evcharge/api/charge/vehicletype/' + this.sessionData.UserVehicles;

    this.http.get<{ vehicletype: string }>(vehicleTypeUrl, { headers: this.services.getAuthHeaders() }).subscribe(result => {
      this.sessionData.vehicleType = result.vehicletype;
    })
  }

  proceedToRating() {

    let sessionUrl = 'http://localhost:8765/evcharge/api/charge/completed';

    let body = {
      owner_id: parseInt(this.services.getOwnerID()),
      car_license_plate: this.sessionData.UserVehicles,
      charging_point_id: parseInt(this.sessionData.Points),
      charging_station_id: parseInt(this.sessionData.Stations),
      connection_time: this.sessionData.ConnectionTime,
      disconnect_time: this.sessionData.DisconnectionTime,
      kWh_delivered: this.sessionData.KWhDelivered,
      protocol: this.sessionData.Protocols,
      payment: "card",
      cost: this.sessionData.cost,
      vehicle_type: this.sessionData.vehicleType,
      rating: null
    }

    this.http.post<{ message: string, session_id: number }>(sessionUrl, body, { headers: this.services.getAuthHeaders() }).subscribe(result => {

      localStorage.setItem("SessionID", this.services.encrypt(JSON.stringify(result.session_id)));
      this.router.navigateByUrl('/rating');
      this.services.setSessionProgress("rating");

    });
  }

  ngOnInit(): void {
    if (this.services.getSessionProgress() == 'payment') {
      this.services.setSessionProgress("skipped");
      localStorage.setItem("sessionProgress", this.services.encrypt(JSON.stringify(this.services.getSessionProgress())));
    }
    else if (this.services.getSessionProgress() != "rating") {
      this.services.setSessionProgress("");
    }
    
  }
}
