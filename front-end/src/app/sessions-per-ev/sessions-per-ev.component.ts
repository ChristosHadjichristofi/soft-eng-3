import { HttpClient, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SessionsPerEVDto } from '../DTOs/SessionsPerEVDTO';
import { Services } from '../providers/services';

@Component({
  selector: 'app-sessions-per-ev',
  templateUrl: './sessions-per-ev.component.html',
  styleUrls: ['./sessions-per-ev.component.scss']
})
export class SessionsPerEVComponent implements OnInit {

  inputVehicleID = null;
  inputDateFrom: string;
  inputDateTo: string;
  UserVehicles = [];
  object: SessionsPerEVDto;

  constructor(private http: HttpClient, private services: Services) { }

  ngOnInit(): void {
    this.object = null;

    

    var url = 'http://localhost:8765/evcharge/api/charge/licenseplates/' + this.services.getOwnerID();

    this.http.get<{ LicensePlateList: { license_plate: string }[] }>(url, { headers: this.services.getAuthHeaders() }).subscribe(result => {
      this.UserVehicles = result.LicensePlateList;
    });
  }

  FetchData() {
  
    

    var licencePlates = this.inputVehicleID;
    var fromDate = this.inputDateFrom.slice(0,4) + this.inputDateFrom.slice(5,7) + this.inputDateFrom.slice(8,10);
    var toDate = this.inputDateTo.slice(0,4) + this.inputDateTo.slice(5,7) + this.inputDateTo.slice(8,10);

    var url = 'http://localhost:8765/evcharge/api/SessionsPerEV/' + licencePlates + '/' + fromDate + '/' + toDate;

    this.http.get<SessionsPerEVDto>(url, { headers: this.services.getAuthHeaders() }).subscribe(sessions => {
      this.object = sessions;
    });
  }

}
