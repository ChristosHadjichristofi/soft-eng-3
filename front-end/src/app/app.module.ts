import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AgmCoreModule } from '@agm/core';
import { ChartsModule } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { SessionsPerEVComponent } from './sessions-per-ev/sessions-per-ev.component';
import { SessionsPerPointComponent } from './sessions-per-point/sessions-per-point.component';
import { SessionsPerProviderComponent } from './sessions-per-provider/sessions-per-provider.component';
import { SessionsPerStationComponent } from './sessions-per-station/sessions-per-station.component';
import { StationAdminLandingPageComponent } from './station-admin-landing-page/station-admin-landing-page.component';
import { OwnerLandingPageComponent } from './owner-landing-page/owner-landing-page.component';
import { ChargePageComponent } from './charge-page/charge-page.component';
import { PaymentPageComponent } from './payment-page/payment-page.component';
import { RatingPageComponent } from './rating-page/rating-page.component';
import { LogoutPageComponent } from './logout-page/logout-page.component';
import { InvoicePageComponent } from './invoice-page/invoice-page.component';
import { MapPageComponent } from './map-page/map-page.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    NotFoundPageComponent,
    HeaderComponent,
    LandingPageComponent,
    SessionsPerEVComponent,
    SessionsPerPointComponent,
    SessionsPerProviderComponent,
    SessionsPerStationComponent,
    StationAdminLandingPageComponent,
    OwnerLandingPageComponent,
    ChargePageComponent,
    PaymentPageComponent,
    RatingPageComponent,
    LogoutPageComponent,
    InvoicePageComponent,
    MapPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBiDRgN8NunzmngcE1R_ZO2PMMwa4JbpJs'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
