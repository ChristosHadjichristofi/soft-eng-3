import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SessionsPerStationDto } from '../DTOs/SessionsPerStationDTO';
import { Services } from '../providers/services';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-sessions-per-station',
  templateUrl: './sessions-per-station.component.html',
  styleUrls: ['./sessions-per-station.component.scss']
})
export class SessionsPerStationComponent implements OnInit {

  inputStationID = null;
  inputDateFrom: string;
  inputDateTo: string;
  object: SessionsPerStationDto;
  AdminStations = [];

  chartOptions: ChartOptions = {
    responsive: true,
  };
  chartLabels = [];
  chartType: string;
  chartLegend: boolean;
  chartData = [];
  chartOptions2: ChartOptions = {
    responsive: true,
  };
  chartType2: string;
  chartData2 = [];

  constructor(private http: HttpClient, private services: Services) { }

  ngOnInit(): void {
    this.object = null;

    

    var url = 'http://localhost:8765/evcharge/api/charge/adminstations/' + this.services.getAdminID();

    this.http.get<{ StationList: { station_id: string, station_name: string }[] }>(url, { headers: this.services.getAuthHeaders() }).subscribe(result => {
      this.AdminStations = result.StationList;
    });
  }

  FetchData() {
  
    

    var station = this.inputStationID;
    var fromDate = this.inputDateFrom.slice(0,4) + this.inputDateFrom.slice(5,7) + this.inputDateFrom.slice(8,10);
    var toDate = this.inputDateTo.slice(0,4) + this.inputDateTo.slice(5,7) + this.inputDateTo.slice(8,10);

    var url = 'http://localhost:8765/evcharge/api/SessionsPerStation/' + station + '/' + fromDate + '/' + toDate;

    this.http.get<SessionsPerStationDto>(url, { headers: this.services.getAuthHeaders() }).subscribe(sessions => {
      this.object = sessions;

      // chart's data
      let x_providers = [];
      let y_providers = [];
      let y_providers2 = [];
      for (let item of this.object.SessionsSummaryList){
        x_providers.push(item.PointID);
        y_providers.push(item.PointSessions);
        y_providers2.push(item.EnergyDelivered);
      }
      
      // first chart's options
      this.chartOptions = {
        responsive: true,
        title: {
          display: true,
          text: 'Sessions per point',
          fontSize: 18,
          fontColor: 'white'
        }, 
        legend: {
            labels: {
               fontColor: 'white'
            }
        }
      };
      this.chartLabels  = x_providers;
      this.chartType = 'polarArea';
      this.chartLegend = true;
      this.chartData = [
        { data:y_providers}
      ];
      // second chart's options
      this.chartOptions2 = {
        responsive: true,
        title: {
          display: true,
          text: 'Energy delivered(KWh) per point',
          fontSize: 18,
          fontColor: 'white'
        }, 
        legend: {
            labels: {
               fontColor: 'white'
            }
        }
      };
      this.chartType2 = 'polarArea';
      this.chartData2 = [
        { data:y_providers2}
      ];

    });

  }

}
