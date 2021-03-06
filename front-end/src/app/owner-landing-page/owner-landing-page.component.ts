import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Services } from '../providers/services';

@Component({
  selector: 'app-owner-landing-page',
  templateUrl: './owner-landing-page.component.html',
  styleUrls: ['./owner-landing-page.component.scss']
})
export class OwnerLandingPageComponent implements OnInit {

  constructor(public services: Services) { }

  ngOnInit(): void { }

}
