import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Services } from '../providers/services';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  constructor(private services: Services, private router: Router) { }

  ngOnInit(): void {
    if (localStorage.getItem('authToken'))
      this.router.navigateByUrl(this.services.getUserRole());
  }

}
