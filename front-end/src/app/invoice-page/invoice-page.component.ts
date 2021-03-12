import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { Services } from '../providers/services';
import { OwnerTotalsDto } from '../DTOs/InvoiceDTO';
import { OwnerListDto } from '../DTOs/InvoiceDTO';
import { AdminlistDto } from '../DTOs/InvoiceDTO';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-invoice-page',
  templateUrl: './invoice-page.component.html',
  styleUrls: ['./invoice-page.component.scss']
})
export class InvoicePageComponent implements OnInit {

  form: FormGroup;

  get inputYear() { return this.form.get('inputYear'); }
  get inputMonth() { return this.form.get('inputMonth'); }

  ownerTotals: OwnerTotalsDto;
  ownerList: OwnerListDto;
  adminList: AdminlistDto;
  role: string;
  name: string;
  username: string;
  year: string;
  month: string;
  months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  yearsList = [];

  constructor(public toastr: ToastrService, private http: HttpClient, public services: Services) {

    this.form = new FormGroup({
      inputYear: new FormControl(null, Validators.required),
      inputMonth: new FormControl(null, Validators.required)
    });

    this.getYears();

  }

  ngOnInit(): void { }

  getResults() { (this.form.valid) ? this.FetchData() : this.toastr.error("Form invalid!"); }

  FetchData() {
    this.year = this.inputYear.value;
    this.month = this.inputMonth.value;
    this.role = this.services.getUserRole();
    this.name = this.services.getUserName();

    if (this.role == 'owner') {
      this.ownerTotals = null;
      this.ownerList = null;
      var url1 = 'https://localhost:8765/evcharge/api/invoice/costenergytotals/' + this.services.getOwnerID() + '/' + this.year + '/' + this.month;

      this.http.get<OwnerTotalsDto>(url1, { headers: this.services.getAuthHeaders() }).subscribe(ownerTotals => {
        this.ownerTotals = ownerTotals;

        if (this.ownerTotals.total_cost != null) {
          var url2 = 'https://localhost:8765/evcharge/api/invoice/chargeslist/' + this.services.getOwnerID() + '/' + this.year + '/' + this.month;

          this.http.get<OwnerListDto>(url2, { headers: this.services.getAuthHeaders() }).subscribe(ownerList => {
            this.ownerList = ownerList;
          });
        }

      });
    }
    else {
      this.adminList = null;
      var url = 'https://localhost:8765/evcharge/api/invoice/adminlist/' + this.services.getAdminID() + '/' + this.year + '/' + this.month;

      this.http.get<AdminlistDto>(url, { headers: this.services.getAuthHeaders() }).subscribe(adminList => {
        this.adminList = adminList;
      });
    }
  }

  getYears() {
    let url = 'https://localhost:8765/evcharge/api/charge/getyears';
    this.http.get<{ yearsList: { year: string }[] }>(url, { headers: this.services.getAuthHeaders() }).subscribe(result => {
      this.yearsList = result.yearsList;
    });
  }

}
