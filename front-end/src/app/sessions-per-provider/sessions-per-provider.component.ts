import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SessionsPerProviderDto } from '../DTOs/SessionsPerProviderDTO';
import { Services } from '../providers/services';

@Component({
  selector: 'app-sessions-per-provider',
  templateUrl: './sessions-per-provider.component.html',
  styleUrls: ['./sessions-per-provider.component.scss']
})
export class SessionsPerProviderComponent implements OnInit {

  inputProviderID: string;
  inputDateFrom: string;
  inputDateTo: string;
  object: SessionsPerProviderDto;

  constructor(private http: HttpClient, private services: Services) { }

  ngOnInit(): void {
    this.object = null;
  }

  FetchData() {
  
    const headers = new HttpHeaders().set('X-OBSERVATORY-AUTH', localStorage.getItem('authToken'));

    var point = this.inputProviderID;
    var fromDate = this.inputDateFrom.slice(0,4) + this.inputDateFrom.slice(5,7) + this.inputDateFrom.slice(8,10);
    var toDate = this.inputDateTo.slice(0,4) + this.inputDateTo.slice(5,7) + this.inputDateTo.slice(8,10);

    var url = 'http://localhost:8765/evcharge/api/SessionsPerProvider/' + point + '/' + fromDate + '/' + toDate;

    this.http.get<SessionsPerProviderDto>(url, {headers}).subscribe(sessions => {
      this.object = sessions;
      console.log(sessions)
    });

  }
}
