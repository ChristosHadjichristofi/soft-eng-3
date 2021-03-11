import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
  sessionProgress: string;

  constructor(public toastr: ToastrService, public services: Services, public http: HttpClient, private router: Router) {

    try {
      this.sessionProgress = JSON.parse(this.services.decrypt(localStorage.getItem("sessionProgress")))
      localStorage.removeItem("sessionProgress")
    }
    catch { }

    if (this.services.getSessionProgress() != 'rating') {
      (this.sessionProgress == 'skipped') ? this.toastr.info("Session simulation Dropped!") : this.toastr.info("No Session simulation in Progress!");
      this.services.setSessionProgress("");
      this.router.navigateByUrl('/owner');
      return;
    }

    this.sessionID = JSON.parse(this.services.decrypt(localStorage.getItem("SessionID")));
    localStorage.removeItem("SessionID");

  }

  sessionWithRating() {

    let sessionUrl = 'https://localhost:8765/evcharge/api/charge/setrating';

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

  ngOnDestroy(): void {
    this.services.setSessionProgress("");
  }

}
