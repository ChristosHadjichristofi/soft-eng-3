import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { PaymentPageComponent } from '../payment-page/payment-page.component';

@Injectable({
  providedIn: 'root'
})
export class SessionGuard implements CanDeactivate<PaymentPageComponent> {
  canDeactivate(component: PaymentPageComponent): boolean {
    return confirm('Are you sure you want to continue? Any unsaved changes will be lost.');
  }

}
