import { Component, OnInit } from '@angular/core';
import { Services } from '../providers/services';

@Component({
  selector: 'app-station-admin-landing-page',
  templateUrl: './station-admin-landing-page.component.html',
  styleUrls: ['./station-admin-landing-page.component.scss']
})
export class StationAdminLandingPageComponent implements OnInit {

  constructor(public services: Services) { }

  ngOnInit(): void { }

}
