import { Routes } from '@angular/router';
import { ShippingCountryComponent } from './shipping-country/shipping-country.component';

import { ShippingComponent } from './shipping.component';

export default [
  {
    path: "",
    component: ShippingComponent
  },
  {
    path: "edit/:id",
    component: ShippingCountryComponent
  }
] as Routes;
