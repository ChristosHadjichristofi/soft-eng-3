import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SessionsPerStationDto } from '../DTOs/SessionsPerStationDTO';
import { Services } from '../providers/services';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-sessions-per-station',
  templateUrl: './sessions-per-station.component.html',
  styleUrls: ['./sessions-per-station.component.scss']
})
export class SessionsPerStationComponent implements OnInit {

  form: FormGroup;

  get inputStationID() { return this.form.get('inputStationID'); }
  get inputDateFrom() { return this.form.get('inputDateFrom'); }
  get inputDateTo() { return this.form.get('inputDateTo'); }

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

  constructor(public toastr: ToastrService, private http: HttpClient, private services: Services) {
    this.form = new FormGroup({
      inputStationID: new FormControl(null, Validators.required),
      inputDateFrom: new FormControl('', Validators.required),
      inputDateTo: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    this.object = null;

    var url = 'http://localhost:8765/evcharge/api/charge/adminstations/' + this.services.getAdminID();

    this.http.get<{ StationList: { station_id: string, station_name: string }[] }>(url, { headers: this.services.getAuthHeaders() }).subscribe(result => {
      this.AdminStations = result.StationList;
    });
  }

  getResults() { (this.form.valid) ? this.FetchData() : this.toastr.error("Form invalid!"); }

  FetchData() {

    var station = this.inputStationID.value;
    var fromDate = formatDate(this.inputDateFrom.value, 'YYYYMMdd', 'en-US').toString();
    var toDate = formatDate(this.inputDateTo.value, 'YYYYMMdd', 'en-US').toString();
    
    var url = 'http://localhost:8765/evcharge/api/SessionsPerStation/' + station + '/' + fromDate + '/' + toDate;

    this.http.get<SessionsPerStationDto>(url, { headers: this.services.getAuthHeaders() }).subscribe(sessions => {
      this.object = sessions;

      // chart's data
      let x_providers = [];
      let y_providers = [];
      let y_providers2 = [];
      for (let item of this.object.SessionsSummaryList) {
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
      this.chartLabels = x_providers;
      this.chartType = 'polarArea';
      this.chartLegend = true;
      this.chartData = [
        { data: y_providers }
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
        { data: y_providers2 }
      ];

    });

  }

}
