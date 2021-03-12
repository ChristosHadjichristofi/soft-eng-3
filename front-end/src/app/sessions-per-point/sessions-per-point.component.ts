import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SessionsPerPointDto } from '../DTOs/SessionsPerPointDTO';
import { Services } from '../providers/services';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-sessions-per-point',
  templateUrl: './sessions-per-point.component.html',
  styleUrls: ['./sessions-per-point.component.scss']
})
export class SessionsPerPointComponent implements OnInit {

  form: FormGroup;

  get inputPointID() { return this.form.get('inputPointID'); }
  get inputDateFrom() { return this.form.get('inputDateFrom'); }
  get inputDateTo() { return this.form.get('inputDateTo'); }

  object: SessionsPerPointDto;
  AdminPoints = [];

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
  chartOptions3: ChartOptions = {
    responsive: true,
  };
  chartLabels3 = [];
  chartData3 = [];
  chartOptions4: ChartOptions = {
    responsive: true,
  };
  chartType4: string;
  chartLabels4 = [];
  chartData4 = [];


  constructor(public toastr: ToastrService, private http: HttpClient, public services: Services) {
    this.form = new FormGroup({
      inputPointID: new FormControl(null, Validators.required),
      inputDateFrom: new FormControl('', Validators.required),
      inputDateTo: new FormControl('', Validators.required)
    });
   }

  ngOnInit(): void {
    this.object = null;

    var url = 'https://localhost:8765/evcharge/api/charge/adminpoints/' + this.services.getAdminID();

    this.http.get<{ PointList: { point_id: string }[] }>(url, { headers: this.services.getAuthHeaders() }).subscribe(result => {
      this.AdminPoints = result.PointList;
    });
  }

  getResults() { (this.form.valid) ? this.FetchData() : this.toastr.error("Form invalid!"); }

  FetchData() {

    var point = this.inputPointID.value;
    var fromDate = formatDate(this.inputDateFrom.value, 'YYYYMMdd', 'en-US').toString();
    var toDate = formatDate(this.inputDateTo.value, 'YYYYMMdd', 'en-US').toString();

    var url = 'https://localhost:8765/evcharge/api/SessionsPerPoint/' + point + '/' + fromDate + '/' + toDate;

    this.http.get<SessionsPerPointDto>(url, { headers: this.services.getAuthHeaders() }).subscribe(sessions => {
      this.object = sessions;

      // charts' data
      let x_providers = ["normal(20kW)","fast(50kW)"];
      let y_providers = [0,0];
      let x_providers2 = [];
      let y_providers2 = [];
      let x_providers3 = [];
      let y_providers3 = [];
      let x_providers4 = [];
      let x_providers4_aux = [];
      let y_providers4 = [];
      for (let item of this.object.ChargingSessionsList){
        // chart 1
        if(item.Protocol == "normal(20kW)")
          y_providers[0]++;
        else
        y_providers[1]++;
        // chart 2
        let tempidx2 = x_providers2.indexOf(item.VehicleType);
        if(tempidx2<0){
          x_providers2.push(item.VehicleType);
          y_providers2.push(1);
        }
        else{
          y_providers2[tempidx2]++;
        }
        // chart 3
        let tempidx3 = x_providers3.indexOf(item.Payment);
        if(tempidx3<0){
          x_providers3.push(item.Payment);
          y_providers3.push(1);
        }
        else{
          y_providers3[tempidx3]++;
        }
        // chart 4
        let raw_date = item.StartedOn;
        let charge_date = new Date(parseInt(raw_date.slice(0,4)), parseInt(raw_date.slice(5,7))-1);
        let tempidx4 = x_providers4_aux.indexOf(charge_date.toString());
        if(tempidx4<0){
          x_providers4_aux.push(charge_date.toString());
          x_providers4.push(charge_date);
          y_providers4.push(parseFloat(item.EnergyDelivered));
        }
        else{
          y_providers4[tempidx4]+=parseFloat(item.EnergyDelivered);
        }
      }

      // first chart's options
      this.chartOptions = {
        responsive: true,
        title: {
          display: true,
          text: 'Sessions per protocol',
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
        { data:y_providers}
      ];
      
      // second chart's options
      this.chartOptions2 = {
        responsive: true,
        title: {
          display: true,
          text: 'Sessions per vehicle type',
          fontSize: 18,
          fontColor: 'white'
        }, 
        legend: {
            labels: {
               fontColor: 'white'
            }
        }
      };
      this.chartLabels2  = x_providers2;
      this.chartData2 = [
        { data:y_providers2}
      ];

      // third chart's options
      this.chartOptions3 = {
        responsive: true,
        title: {
          display: true,
          text: 'Sessions per payment method',
          fontSize: 18,
          fontColor: 'white'
        }, 
        legend: {
            labels: {
               fontColor: 'white'
            }
        }
      };
      this.chartLabels3  = x_providers3;
      this.chartData3 = [
        { data:y_providers3}
      ];

      // fourth chart's options
      this.chartOptions4 = {
        legend: {
          display: false
        },
        responsive: true,
        title: {
          display: true,
          text: 'Total energy per month',
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
                display: false,
                labelString: 'Total energy delivered(KWh)',
                fontColor: 'white'
              }
            }
          ]
        }        
      };
      this.chartType4 = 'bar';
      this.chartLabels4  = x_providers4;
      this.chartData4 = [
        { data:y_providers4, label: "energy(KWh)"}
      ];
    });


  }
  
}
