import { Component, inject, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Store, Select } from '@ngxs/store';
import { Observable, Subject, of } from 'rxjs';
import { switchMap, mergeMap, takeUntil } from 'rxjs/operators';
import { ShippingRuleModalComponent } from "../modal/shipping-rule-modal/shipping-rule-modal.component";
import { ShippingState } from '../../../shared/state/shipping.state';
import { Shipping } from '../../../shared/interface/shipping.interface';
import { EditShipping, DeleteShippingRule } from '../../../shared/action/shipping.action';
import { TranslateModule } from '@ngx-translate/core';
import { NoDataComponent } from '../../../shared/components/ui/no-data/no-data.component';
import { FormShippingComponent } from '../form-shipping/form-shipping.component';
import { CommonModule } from '@angular/common';
import { NgbAccordionDirective, NgbAccordionItem, NgbAccordionHeader, NgbAccordionToggle, NgbAccordionButton, NgbCollapse, NgbAccordionCollapse, NgbAccordionBody } from '@ng-bootstrap/ng-bootstrap';
import { PageWrapperComponent } from '../../../shared/components/page-wrapper/page-wrapper.component';

@Component({
    selector: 'app-shipping-country',
    templateUrl: './shipping-country.component.html',
    styleUrls: ['./shipping-country.component.scss'],
    imports: [PageWrapperComponent, RouterModule, NgbAccordionDirective, NgbAccordionItem, NgbAccordionHeader, NgbAccordionToggle, NgbAccordionButton, NgbCollapse, NgbAccordionCollapse, NgbAccordionBody, FormShippingComponent, NoDataComponent, ShippingRuleModalComponent, CommonModule, TranslateModule]
})
export class ShippingCountryComponent {

  shipping$: Observable<Shipping> = inject(Store).select(ShippingState.selectedShipping) as Observable<Shipping>;

  @ViewChild("createShippingRuleModal") CreateShippingRuleModal: ShippingRuleModalComponent;

  public id: number;
  private destroy$ = new Subject<void>();

  constructor(private store: Store,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap(params => {
            if(!params['id']) return of();
            return this.store
                      .dispatch(new EditShipping(params['id']))
                      .pipe(mergeMap(() => this.store.select(ShippingState.selectedShipping)))
          }
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(shipping => {
        this.id = shipping?.id!;
      });
  }

  delete(actionType: string, data: Shipping) {
    this.store.dispatch(new DeleteShippingRule(data?.id))
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
