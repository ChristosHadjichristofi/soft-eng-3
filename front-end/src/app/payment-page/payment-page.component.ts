import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Services } from '../providers/services';

interface SessionData {
  ConnectionTime: string;
  DisconnectionTime: string;
  KWhDelivered: number;
  Points: string;
  Protocols: string;
  Stations: string;
  UserVehicles: string;
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

  constructor(public services: Services, public http: HttpClient) {
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
      });
    });
  }

  ngOnInit(): void {
  }
}
