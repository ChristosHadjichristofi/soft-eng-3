import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SessionsPerStationDto } from '../DTOs/SessionsPerStationDTO';
import { Services } from '../providers/services';

@Component({
  selector: 'app-sessions-per-station',
  templateUrl: './sessions-per-station.component.html',
  styleUrls: ['./sessions-per-station.component.scss']
})
export class SessionsPerStationComponent implements OnInit {

  inputStationID: string;
  inputDateFrom: string;
  inputDateTo: string;
  object: SessionsPerStationDto;

  constructor(private http: HttpClient, private services: Services) { }

  ngOnInit(): void {
    this.object = null;
  }

  FetchData() {
  
    const headers = new HttpHeaders().set('X-OBSERVATORY-AUTH', localStorage.getItem('authToken'));

    var station = this.inputStationID;
    var fromDate = this.inputDateFrom.slice(0,4) + this.inputDateFrom.slice(5,7) + this.inputDateFrom.slice(8,10);
    var toDate = this.inputDateTo.slice(0,4) + this.inputDateTo.slice(5,7) + this.inputDateTo.slice(8,10);

    var url = 'http://localhost:8765/evcharge/api/SessionsPerStation/' + station + '/' + fromDate + '/' + toDate;

    this.http.get<SessionsPerStationDto>(url, {headers}).subscribe(sessions => {
      this.object = sessions;
    });

  }

}
