import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Services } from '../providers/services';

interface SessionData {
  ConnectionTime: string;
  DisconnectionTime: string;
  KWhDelivered: number;
  Points: string;
  Protocols: string;
  Stations: string;
  UserVehicles: string;
  cost?: string;
  rating?: string;
  vehicleType: string;
}

@Component({
  selector: 'app-rating-page',
  templateUrl: './rating-page.component.html',
  styleUrls: ['./rating-page.component.scss']
})
export class RatingPageComponent implements OnInit {

  sessionData: SessionData;
  rating: number = 0;
  constructor(public services: Services, public http: HttpClient, private router: Router) {

    this.sessionData = JSON.parse(this.services.decrypt(localStorage.getItem("SessionData")));
    localStorage.removeItem("SessionData");
    console.log(this.sessionData);

  }

  sessionWithRating() {

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
      rating: this.rating
    }

    this.http.post(sessionUrl, body, { headers: this.services.getAuthHeaders() }).subscribe();

    this.router.navigateByUrl('/owner');

  }

  sessionWithoutRating() {

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
      rating: this.rating
    }

    this.http.post(sessionUrl, body, { headers: this.services.getAuthHeaders() }).subscribe();

    this.router.navigateByUrl('/owner');

  }

  ngOnInit(): void { }

}
