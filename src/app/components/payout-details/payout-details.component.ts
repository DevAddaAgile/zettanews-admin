import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { GetPaymentDetails, UpdatePaymentDetails } from '../../shared/action/payment-details.action';
import { PaymentDetailsState } from '../../shared/state/payment-details.state';
import { PaymentDetails } from '../../shared/interface/payment-details.interface';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../shared/components/ui/button/button.component';

import { NumberDirective } from '../../shared/directive/numbers-only.directive';
import { FormFieldsComponent } from '../../shared/components/ui/form-fields/form-fields.component';
import { NgbNav, NgbNavItem, NgbNavItemRole, NgbNavLink, NgbNavLinkBase, NgbNavContent, NgbNavOutlet } from '@ng-bootstrap/ng-bootstrap';
import { PageWrapperComponent } from '../../shared/components/page-wrapper/page-wrapper.component';

@Component({
    selector: 'app-payout-details',
    templateUrl: './payout-details.component.html',
    styleUrls: ['./payout-details.component.scss'],
    imports: [PageWrapperComponent, ReactiveFormsModule, NgbNav, NgbNavItem, NgbNavItemRole, NgbNavLink, NgbNavLinkBase, NgbNavContent, FormFieldsComponent, NumberDirective, NgbNavOutlet, ButtonComponent, TranslateModule]
})
export class PayoutDetailsComponent {

  paymentDetails$: Observable<PaymentDetails> = inject(Store).select(PaymentDetailsState.paymentDetails) as Observable<PaymentDetails>;
  
  public form: FormGroup;
  public active = 'bank';

  constructor(private store: Store) {
    this.form = new FormGroup({
      bank_account_no: new FormControl(),
      bank_name: new FormControl(),
      bank_holder_name: new FormControl(),
      swift: new FormControl(),
      ifsc: new FormControl(),
      paypal_email: new FormControl('', [Validators.email]),
    });
  }

  ngOnInit() {
    this.store.dispatch(new GetPaymentDetails());
    this.paymentDetails$.subscribe(paymentDetails => {
      this.form.patchValue({
        bank_account_no: paymentDetails?.bank_account_no,
        bank_name: paymentDetails?.bank_name,
        bank_holder_name: paymentDetails?.bank_holder_name,
        swift:paymentDetails?.swift,
        ifsc: paymentDetails?.ifsc,
        paypal_email: paymentDetails?.paypal_email
      })
    });
  }

  submit(){    
    this.form.markAllAsTouched();
    if(this.form.valid){
      this.store.dispatch(new UpdatePaymentDetails(this.form.value));
    }
  }

}
