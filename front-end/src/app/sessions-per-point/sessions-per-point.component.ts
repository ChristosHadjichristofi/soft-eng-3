import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SessionsPerPointDto } from '../DTOs/SessionsPerPointDTO';
import { Services } from '../providers/services';

@Component({
  selector: 'app-sessions-per-point',
  templateUrl: './sessions-per-point.component.html',
  styleUrls: ['./sessions-per-point.component.scss']
})
export class SessionsPerPointComponent implements OnInit {

  inputPointID = null;
  inputDateFrom: string;
  inputDateTo: string;
  object: SessionsPerPointDto;
  AdminPoints = [];

  constructor(private http: HttpClient, private services: Services) { }

  ngOnInit(): void {
    this.object = null;

    

    var url = 'http://localhost:8765/evcharge/api/charge/adminpoints/' + this.services.getAdminID();

    this.http.get<{ PointList: { point_id: string }[] }>(url, { headers: this.services.getAuthHeaders() }).subscribe(result => {
      this.AdminPoints = result.PointList;
    });
  }

  FetchData() {
  
    

    var point = this.inputPointID;
    var fromDate = this.inputDateFrom.slice(0,4) + this.inputDateFrom.slice(5,7) + this.inputDateFrom.slice(8,10);
    var toDate = this.inputDateTo.slice(0,4) + this.inputDateTo.slice(5,7) + this.inputDateTo.slice(8,10);

    var url = 'http://localhost:8765/evcharge/api/SessionsPerPoint/' + point + '/' + fromDate + '/' + toDate;

    this.http.get<SessionsPerPointDto>(url, { headers: this.services.getAuthHeaders() }).subscribe(sessions => {
      this.object = sessions;
    });

  }
  
}
