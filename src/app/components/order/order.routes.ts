import { Routes } from '@angular/router';

import { CheckoutComponent } from './checkout/checkout.component';
import { CreateOrderComponent } from './create-order/create-order.component';
import { DetailsComponent } from './details/details.component';
import { OrderComponent } from './order.component';

export default [
  {
    path: '',
    component: OrderComponent
  },
  {
    path: 'details/:id',
    component: DetailsComponent
  },
  {
    path: 'create',
    component: CreateOrderComponent
  },
  {
    path: 'checkout',
    component: CheckoutComponent
  }
] as Routes;
