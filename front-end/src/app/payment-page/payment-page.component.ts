import { Component, OnInit } from '@angular/core';
import { Services } from '../providers/services';

@Component({
  selector: 'app-payment-page',
  templateUrl: './payment-page.component.html',
  styleUrls: ['./payment-page.component.scss']
})
export class PaymentPageComponent implements OnInit {

  sessionObj: {}

  constructor(public services: Services) { }

  ngOnInit(): void {}
}
