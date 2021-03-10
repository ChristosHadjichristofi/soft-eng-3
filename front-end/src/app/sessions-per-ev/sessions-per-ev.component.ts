import { HttpClient, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SessionsPerEVDto } from '../DTOs/SessionsPerEVDTO';
import { Services } from '../providers/services';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { formatDate, getLocaleDateFormat } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sessions-per-ev',
  templateUrl: './sessions-per-ev.component.html',
  styleUrls: ['./sessions-per-ev.component.scss'],
})
export class SessionsPerEVComponent implements OnInit {

  form: FormGroup;

  get inputVehicleID() { return this.form.get('inputVehicleID'); }
  get inputDateFrom() { return this.form.get('inputDateFrom'); }
  get inputDateTo() { return this.form.get('inputDateTo'); }

  UserVehicles = [];
  object: SessionsPerEVDto;

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
  chartLabels2 = [];
  chartData2 = [];
  chartType2: string;
  chartData3 = [];

  constructor(public toastr: ToastrService, private http: HttpClient, private services: Services) {

    this.form = new FormGroup({
      inputVehicleID: new FormControl(null, Validators.required),
      inputDateFrom: new FormControl('', Validators.required),
      inputDateTo: new FormControl('', Validators.required)
    });

   }

  ngOnInit(): void {
    this.object = null;

    var url = 'http://localhost:8765/evcharge/api/charge/licenseplates/' + this.services.getOwnerID();

    this.http.get<{ LicensePlateList: { license_plate: string }[] }>(url, { headers: this.services.getAuthHeaders() }).subscribe(result => {
      this.UserVehicles = result.LicensePlateList;
    });
  }

  getResults() { (this.form.valid) ? this.FetchData() : this.toastr.error("Form invalid!"); }

  FetchData() {
    var licencePlates = this.inputVehicleID.value;
    var fromDate = formatDate(this.inputDateFrom.value, 'YYYYMMdd', 'en-US').toString();
    var toDate = formatDate(this.inputDateTo.value, 'YYYYMMdd', 'en-US').toString();

    var url = 'http://localhost:8765/evcharge/api/SessionsPerEV/' + licencePlates + '/' + fromDate + '/' + toDate;

    this.http.get<SessionsPerEVDto>(url, { headers: this.services.getAuthHeaders() }).subscribe(sessions => {
      this.object = sessions;

      // first chart's data
      let x_providers = [];
      let y_providers = [];
      for (let item of this.object.VehicleChargingSessionsList){
        let tempidx = x_providers.indexOf(item.EnergyProvider);
        if(tempidx<0){
          x_providers.push(item.EnergyProvider);
          y_providers.push(1);
        }
        else{
          y_providers[tempidx]++;
        }
      }
      // first chart's options
      this.chartOptions = {
        responsive: true,
        title: {
          display: true,
          text: 'Sessions per engergy provider',
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
      this.chartType = 'doughnut';
      this.chartLegend = true;
      this.chartData = [
        { data:y_providers, label:"sessions"}
      ];

      // second chart's data
      let x_providers2 = [];
      let x_providers2_aux = [];
      let y_providers3 = [];
      let y_providers2 = [];
      for (let item of this.object.VehicleChargingSessionsList){
        let raw_date = item.StartedOn;
        let charge_date = new Date(parseInt(raw_date.slice(0,4)), parseInt(raw_date.slice(5,7))-1, parseInt(raw_date.slice(8,10)));
        let tempidx = x_providers2_aux.indexOf(charge_date.toString());
        if(tempidx<0){
          x_providers2_aux.push(charge_date.toString());
          x_providers2.push(charge_date);
          y_providers2.push(parseFloat(item.SessionCost));
          y_providers3.push(parseFloat(item.EnergyDelivered));
        }
        else{
          y_providers2[tempidx]+=parseFloat(item.SessionCost);
          y_providers3[tempidx]+=parseFloat(item.EnergyDelivered);
        }
      }
      // second chart's options
      this.chartOptions2 = {
        legend: {
          display: false
        },
        responsive: true,
        title: {
          display: true,
          text: 'Energy and Cost per day',
          fontSize: 18,
          fontColor: 'white'
        },
        scales: {
          xAxes: [
            {ticks: {
              fontColor: 'white'
            },
            gridLines: {
                 display: false,
                 color: 'rgba(255, 255, 255, 1)'
            },
            type: 'time',
            time: {
                unit: 'day'
            }
          }],
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                stepSize: 1,
                fontColor: 'white'
              },
              gridLines: {
                display:true,
                color: 'rgba(255, 255, 255, 0.5)'
              },
              scaleLabel: {
                display: true,
                labelString: 'Energy delivered(KWh)',
                fontColor: 'white'
              }
            }
          ]
        }        
      };
      this.chartType2 = 'bubble';
      var chartDataTriplets = [];
      x_providers2.forEach(function(e, i) {
        chartDataTriplets.push({
          x: e,
          y: parseFloat(y_providers3[i]),
          r: parseFloat(y_providers2[i]),
        });
      });
      this.chartData2 = [
        {
          data: chartDataTriplets,
          label: 'daily charge [date],[KWh],[€]',
          fontColor: 'white'
          
        }
      ];

    });
  
  }

}
