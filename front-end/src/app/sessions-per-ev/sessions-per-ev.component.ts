import { HttpClient, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SessionsPerEVDto } from '../DTOs/SessionsPerEVDTO';
import { Services } from '../providers/services';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';



@Component({
  selector: 'app-sessions-per-ev',
  templateUrl: './sessions-per-ev.component.html',
  styleUrls: ['./sessions-per-ev.component.scss'],
})
export class SessionsPerEVComponent implements OnInit {

  inputVehicleID = null;
  inputDateFrom: string;
  inputDateTo: string;
  UserVehicles = [];
  object: SessionsPerEVDto;

  chartOptions: ChartOptions = {
    responsive: true,
  };
  chartLabels = [];
  chartType: string;
  chartLegend: boolean;
  chartPlugins = [];
  chartData = [];

  chartOptions2: ChartOptions = {
    responsive: true,
  };
  chartLabels2 = [];
  chartData2 = [];
  chartType2: string;
  chartData3 = [];

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


      this.chartOptions = {
        responsive: true,
        title: {
          display: true,
          text: 'Charges per engergy provider',
          fontSize: 18,
          fontColor: 'white'
        }, 
        legend: {
            labels: {
               fontColor: 'white'
            }
        }
      };

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

      this.chartLabels  = x_providers;
      this.chartType = 'doughnut';
      this.chartLegend = true;
      this.chartPlugins = [];
      this.chartData = [
        { data:y_providers, label:"charges"}
      ];

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
      let x_providers2 = [];
      let y_providers3 = [];
      let y_providers2 = [];
      for (let item of this.object.VehicleChargingSessionsList){
        let raw_date = item.StartedOn;
        let charge_date = new Date(parseInt(raw_date.slice(0,4)), parseInt(raw_date.slice(5,7))-1, parseInt(raw_date.slice(8,10)));
        let tempidx = x_providers2.indexOf(charge_date);
        if(tempidx<0){
          x_providers2.push(charge_date);
          y_providers2.push(parseFloat(item.SessionCost));
          y_providers3.push(parseFloat(item.EnergyDelivered));
        }
        else{
          y_providers2[tempidx]+=parseFloat(item.SessionCost);
          y_providers3[tempidx]+=parseFloat(item.EnergyDelivered);
        }
      }
      
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
