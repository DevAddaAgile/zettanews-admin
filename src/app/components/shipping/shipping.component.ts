import { Component, inject, ViewChild } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Shipping, ShippingModel } from '../../shared/interface/shipping.interface';
import { ShippingState } from '../../shared/state/shipping.state';
import { GetShippings, DeleteShipping } from '../../shared/action/shipping.action';
import { ShippingCountryModalComponent } from "./modal/shipping-country-modal/shipping-country-modal.component";
import { DeleteModalComponent } from "../../shared/components/ui/modal/delete-modal/delete-modal.component";
import { TranslateModule } from '@ngx-translate/core';
import { NoDataComponent } from '../../shared/components/ui/no-data/no-data.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HasPermissionDirective } from '../../shared/directive/has-permission.directive';
import { PageWrapperComponent } from '../../shared/components/page-wrapper/page-wrapper.component';

@Component({
    selector: 'app-shipping',
    templateUrl: './shipping.component.html',
    styleUrls: ['./shipping.component.scss'],
    imports: [PageWrapperComponent, HasPermissionDirective, RouterModule, NoDataComponent, ShippingCountryModalComponent, DeleteModalComponent, CommonModule, TranslateModule]
})
export class ShippingComponent {

  shipping$: Observable<ShippingModel> = inject(Store).select(ShippingState.shipping) as Observable<ShippingModel>; 

  @ViewChild("countryShippingModal") CountryShippingModal: ShippingCountryModalComponent;
  @ViewChild("deleteModal") DeleteModal: DeleteModalComponent;

  constructor(private store: Store) {
    this.store.dispatch(new GetShippings());
  }

  delete(actionType: string, data: Shipping) {
    this.store.dispatch(new DeleteShipping(data?.id));
  }

}
