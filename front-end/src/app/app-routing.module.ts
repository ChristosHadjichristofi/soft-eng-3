import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChargePageComponent } from './charge-page/charge-page.component';
import { InvoicePageComponent } from './invoice-page/invoice-page.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { LogoutPageComponent } from './logout-page/logout-page.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { OwnerLandingPageComponent } from './owner-landing-page/owner-landing-page.component';
import { PaymentPageComponent } from './payment-page/payment-page.component';
import { RatingPageComponent } from './rating-page/rating-page.component';
import { SessionsPerEVComponent } from './sessions-per-ev/sessions-per-ev.component';
import { SessionsPerPointComponent } from './sessions-per-point/sessions-per-point.component';
import { SessionsPerProviderComponent } from './sessions-per-provider/sessions-per-provider.component';
import { SessionsPerStationComponent } from './sessions-per-station/sessions-per-station.component';
import { StationAdminLandingPageComponent } from './station-admin-landing-page/station-admin-landing-page.component';
import { MapPageComponent } from './map-page/map-page.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent }
  , { path: 'landing', component: LandingPageComponent }
  , { path: 'login', component: LoginPageComponent }
  , { path: 'sessionsPerEV', component: SessionsPerEVComponent }
  , { path: 'sessionsPerPoint', component: SessionsPerPointComponent }
  , { path: 'sessionsPerProvider', component: SessionsPerProviderComponent }
  , { path: 'sessionsPerStation', component: SessionsPerStationComponent }
  , { path: 'stationadmin', component: StationAdminLandingPageComponent }
  , { path: 'owner', component: OwnerLandingPageComponent }
  , { path: 'charge', component: ChargePageComponent }
  , { path: 'payment', component: PaymentPageComponent }
  , { path: 'rating', component: RatingPageComponent }
  , { path: 'logout', component: LogoutPageComponent }
  , { path: 'invoice', component: InvoicePageComponent }
  , { path: 'map', component: MapPageComponent }
  , { path: '**', component: NotFoundPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
