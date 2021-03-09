import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { Services } from '../providers/services';
import { OwnerTotalsDto } from '../DTOs/InvoiceDTO';
import { OwnerListDto } from '../DTOs/InvoiceDTO';
import { AdminlistDto } from '../DTOs/InvoiceDTO';

@Component({
  selector: 'app-invoice-page',
  templateUrl: './invoice-page.component.html',
  styleUrls: ['./invoice-page.component.scss']
})
export class InvoicePageComponent implements OnInit {

  ownerTotals: OwnerTotalsDto;
  ownerList: OwnerListDto;
  adminList: AdminlistDto;
  inputYear = null;
  inputMonth = null;
  role: string;
  name: string;
  username: string;
  year: string;
  month: string;
  months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
  yearsList = [];

  constructor(private http: HttpClient, private services: Services) { 

    this.getYears();
  
  }

  ngOnInit(): void {
  }

  FetchData() {
    this.year = this.inputYear;
    this.month = this.inputMonth;
    this.role = this.services.getUserRole();
    this.name = this.services.getUserName();
    if(this.role == 'owner'){
      this.ownerTotals = null;
      this.ownerList = null;
      var url1 = 'http://localhost:8765/evcharge/api/invoice/costenergytotals/' + this.services.getOwnerID() + '/' + this.year + '/' + this.month;

      this.http.get<OwnerTotalsDto>(url1, { headers: this.services.getAuthHeaders() }).subscribe(ownerTotals => {
        this.ownerTotals = ownerTotals;

        if(this.ownerTotals.total_cost != null){
          var url2 = 'http://localhost:8765/evcharge/api/invoice/chargeslist/' + this.services.getOwnerID() + '/' + this.year + '/' + this.month;

          this.http.get<OwnerListDto>(url2, { headers: this.services.getAuthHeaders() }).subscribe(ownerList => {
            this.ownerList = ownerList;
          });
        }

      });
    }
    else{
      this.adminList = null;
      var url = 'http://localhost:8765/evcharge/api/invoice/adminlist/' + this.services.getAdminID() + '/' + this.year + '/' + this.month;

      this.http.get<AdminlistDto>(url, { headers: this.services.getAuthHeaders() }).subscribe(adminList => {
        this.adminList = adminList;
        console.log(url);
      });
    }
  }

  getYears() {
    let url = 'http://localhost:8765/evcharge/api/charge/getyears';
    this.http.get<{ yearsList: { year: string }[] }>(url, { headers: this.services.getAuthHeaders() }).subscribe(result => {
      this.yearsList = result.yearsList;
    });
  }

}
