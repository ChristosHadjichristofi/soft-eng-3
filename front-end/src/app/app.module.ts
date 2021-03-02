import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { SessionsPerEVComponent } from './sessions-per-ev/sessions-per-ev.component';
import { SessionsPerPointComponent } from './sessions-per-point/sessions-per-point.component';
import { SessionsPerProviderComponent } from './sessions-per-provider/sessions-per-provider.component';
import { SessionsPerStationComponent } from './sessions-per-station/sessions-per-station.component';
import { StationAdminLandingPageComponent } from './station-admin-landing-page/station-admin-landing-page.component';
import { OwnerLandingPageComponent } from './owner-landing-page/owner-landing-page.component';
import { ChargePageComponent } from './charge-page/charge-page.component';

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
    ChargePageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
