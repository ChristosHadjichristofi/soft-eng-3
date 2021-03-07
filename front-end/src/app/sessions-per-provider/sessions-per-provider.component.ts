import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SessionsPerProviderDto } from '../DTOs/SessionsPerProviderDTO';
import { Services } from '../providers/services';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-sessions-per-provider',
  templateUrl: './sessions-per-provider.component.html',
  styleUrls: ['./sessions-per-provider.component.scss']
})
export class SessionsPerProviderComponent implements OnInit {

  inputProviderID = null;
  inputDateFrom: string;
  inputDateTo: string;
  object: SessionsPerProviderDto;
  Providers = [];

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
  chartData2 = [];

  constructor(private http: HttpClient, private services: Services) { }

  ngOnInit(): void {
    this.object = null;

    var url = 'http://localhost:8765/evcharge/api/charge/providers';

    this.http.get<{ ProviderList: { energy_provider_id: string, energy_provider_name: string }[] }>(url, { headers: this.services.getAuthHeaders() }).subscribe(result => {
      this.Providers = result.ProviderList;
    });
  }

  FetchData() {
  
    

    var point = this.inputProviderID;
    var fromDate = this.inputDateFrom.slice(0,4) + this.inputDateFrom.slice(5,7) + this.inputDateFrom.slice(8,10);
    var toDate = this.inputDateTo.slice(0,4) + this.inputDateTo.slice(5,7) + this.inputDateTo.slice(8,10);

    var url = 'http://localhost:8765/evcharge/api/SessionsPerProvider/' + point + '/' + fromDate + '/' + toDate;

    this.http.get<SessionsPerProviderDto>(url, { headers: this.services.getAuthHeaders() }).subscribe(sessions => {
      this.object = sessions;

      // charts' data
      let x_providers = [];
      let x_providers_aux = [];
      let y_providers = [];
      let y_providers2 = [];
      for (let item of this.object.ProviderChargingSessionsList){
        let raw_date = item.StartedOn;
        let charge_date = new Date(parseInt(raw_date.slice(0,4)), parseInt(raw_date.slice(5,7))-1);
        let tempidx = x_providers_aux.indexOf(charge_date.toString());
        if(tempidx<0){
          x_providers_aux.push(charge_date.toString());
          x_providers.push(charge_date);
          y_providers.push(parseFloat(item.sessionCost));
          y_providers2.push(parseFloat(item.EnergyDelivered));
        }
        else{
          y_providers[tempidx]+=parseFloat(item.sessionCost);
          y_providers2[tempidx]+=parseFloat(item.EnergyDelivered);
        }
      }
      // first chart's options
      this.chartOptions = {
        legend: {
          display: false
        },
        responsive: true,
        title: {
          display: true,
          text: 'Total cost per month',
          fontSize: 18,
          fontColor: 'white'
        },
        scales: {
          xAxes: [
            {ticks: {
              fontColor: 'white'
            },
            offset: true,
            gridLines: {
                 display: false,
                 color: 'rgba(255, 255, 255, 1)'
            },
            type: 'time',
            time: {
                unit: 'month'
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
                labelString: 'Total cost(€)',
                fontColor: 'white'
              }
            }
          ]
        }        
      };
      this.chartType = 'line';
      this.chartLabels  = x_providers;
      this.chartData = [
        { data:y_providers, label: "Cost[€]", lineTension: 0}
      ];
      // second chart's options
      this.chartOptions2 = {
        legend: {
          display: false
        },
        responsive: true,
        title: {
          display: true,
          text: 'Total energy delivered per month',
          fontSize: 18,
          fontColor: 'white'
        },
        scales: {
          xAxes: [
            {ticks: {
              fontColor: 'white'
            },
            offset: true,
            gridLines: {
                 display: false,
                 color: 'rgba(255, 255, 255, 1)'
            },
            type: 'time',
            time: {
                unit: 'month'
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
                labelString: 'Total energy deliverd(KWh)',
                fontColor: 'white'
              }
            }
          ]
        }        
      };
      this.chartData2 = [
        { data:y_providers2, label: "Energy[KWh]", lineTension: 0}
      ];
    });

  }
}
