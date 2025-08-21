import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-payment-block',
    templateUrl: './payment-block.component.html',
    styleUrls: ['./payment-block.component.scss'],
    imports: [TranslateModule]
})
export class PaymentBlockComponent {

  @Output() selectPaymentMethod: EventEmitter<string> = new EventEmitter();

  constructor() { }

  set(value: string) {
    this.selectPaymentMethod.emit(value);
  }

}
