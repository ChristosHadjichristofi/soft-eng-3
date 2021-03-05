import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
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

  constructor(public services: Services, public http: HttpClient, private router: Router) {
    this.sessionData = JSON.parse(this.services.decrypt(localStorage.getItem("SessionData")));
    localStorage.removeItem("SessionData");
    console.log(this.sessionData);

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

    this.http.get<{vehicletype: string}>(vehicleTypeUrl, { headers: this.services.getAuthHeaders() }).subscribe(result => {
      this.sessionData.vehicleType = result.vehicletype;
    })
  }

  proceedToRating() {
    localStorage.setItem("SessionData", this.services.encrypt(JSON.stringify(this.sessionData)));

    this.router.navigateByUrl('/rating');
  }

  ngOnInit(): void {
  }
}
