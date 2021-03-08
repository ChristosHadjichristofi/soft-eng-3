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
  sessionID: number;

  constructor(public services: Services, public http: HttpClient, private router: Router) {

    this.sessionID = JSON.parse(this.services.decrypt(localStorage.getItem("SessionID")));
    localStorage.removeItem("SessionID");

  }

  sessionWithRating() {

    let sessionUrl = 'http://localhost:8765/evcharge/api/charge/setrating';

    let body = {
      session_id: this.sessionID,
      rating: this.rating
    }

    this.http.post(sessionUrl, body, { headers: this.services.getAuthHeaders() }).subscribe();

    this.router.navigateByUrl('/owner');

  }

  sessionWithoutRating() {
    this.router.navigateByUrl('/owner');
  }

  ngOnInit(): void { }

}
