import { Component, EventEmitter, inject, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Values } from '../../../../../shared/interface/setting.interface';
import { SettingState } from '../../../../../shared/state/setting.state';
import { CurrencySymbolPipe } from '../../../../pipe/currency-symbol.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { HasPermissionDirective } from '../../../../directive/has-permission.directive';
import { UpperCasePipe } from '@angular/common';
import { ButtonComponent } from '../../button/button.component';

@Component({
    selector: 'app-payout-modal',
    templateUrl: './payout-modal.component.html',
    styleUrls: ['./payout-modal.component.scss'],
    imports: [ButtonComponent, HasPermissionDirective, UpperCasePipe, TranslateModule, CurrencySymbolPipe]
})
export class PayoutModalComponent {

  public modalOpen: boolean = false;
  public closeResult: string;
  public active = 'upload';
  public payoutData: any;
  public payoutStatus: any = {} 

  setting$: Observable<Values> = inject(Store).select(SettingState.setting) as Observable<Values>;

  @Input() label: string;
  @Input() action: boolean;
  
  @Output() payout: EventEmitter<any> = new EventEmitter();
  @ViewChild("payoutModal", { static: false }) PayoutModal: TemplateRef<string>;

  constructor( private modalService: NgbModal) { }
    
  async openModal(data: any) {
    this.payoutData = data
    this.payoutStatus.data = data
    this.modalOpen = true;
    this.modalService.open(this.PayoutModal, {
      ariaLabelledBy: 'Payout-Modal',
      centered: true,
      windowClass: 'theme-modal text-center'
    }).result.then((result) => {
      `Result ${result}`
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: ModalDismissReasons): string {
    this.active = 'upload';
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  actionPerform(status: string){
    this.payoutStatus.status = status
    this.payout.emit(this.payoutStatus);
  }

  ngOnDestroy() {
    if (this.modalOpen) {
      this.modalService.dismissAll();
    }
  }

}
