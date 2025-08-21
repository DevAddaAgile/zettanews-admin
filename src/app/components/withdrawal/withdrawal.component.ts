import { Component, inject, ViewChild } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SettingState } from '../../shared/state/setting.state';
import { WithdrawalState } from '../../shared/state/withdrawal.state';
import { VendorWalletState } from '../../shared/state/vendor-wallet.state';
import { GetWithdrawRequest, UpdateWithdrawStatus } from '../../shared/action/withdrawal.action';
import { PayoutModalComponent } from '../../shared/components/ui/modal/payout-modal/payout-modal.component';
import { WithdrawRequestModalComponent } from './modal/withdraw-request-modal/withdraw-request-modal.component';
import { Params } from '../../shared/interface/core.interface';
import { Values } from '../../shared/interface/setting.interface';
import { TableClickedAction, TableConfig } from '../../shared/interface/table.interface';
import { Withdrawal, WithdrawalModel } from '../../shared/interface/withdrawal.interface';
import { AccountState } from '../../shared/state/account.state';
import { GetVendorTransaction } from '../../shared/action/vendor-wallet.action';
import { CurrencySymbolPipe } from '../../shared/pipe/currency-symbol.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { TableComponent } from '../../shared/components/ui/table/table.component';
import { PageWrapperComponent } from '../../shared/components/page-wrapper/page-wrapper.component';
import { CommonModule } from '@angular/common';
import { TransactionsData } from 'src/app/shared/interface/vendor-wallet.interface';

@Component({
    selector: 'app-withdrawal',
    templateUrl: './withdrawal.component.html',
    styleUrls: ['./withdrawal.component.scss'],
    imports: [PageWrapperComponent, TableComponent, PayoutModalComponent, WithdrawRequestModalComponent, CommonModule, TranslateModule, CurrencySymbolPipe]
})
export class WithdrawalComponent {

  withdrawal$: Observable<WithdrawalModel> = inject(Store).select(WithdrawalState.withdrawal);
  wallet$: Observable<{ consumer_id: number | null; balance: number; transactions: { data: TransactionsData[]; total: number; }}> = inject(Store).select(VendorWalletState.vendorWallet);
  setting$: Observable<Values> = inject(Store).select(SettingState.setting) as Observable<Values>;
  roleName$: Observable<string> = inject(Store).select(AccountState.getRoleName) as Observable<string>;
  
  @ViewChild("payoutModal") PayoutModal: PayoutModalComponent;
  @ViewChild("requestModal") RequestModal: WithdrawRequestModalComponent;

  public tableConfig: TableConfig = {
    columns: [
      { title: "No.", dataField: "no", type: "no" },
      { title: "name", dataField: "vendor_name", sortable: true, sort_direction: 'desc' },
      { title: "amount", dataField: "amount", type: 'price' },
      { title: "status", dataField: "withdrawal_status" },
      { title: "created_at", dataField: "created_at", type: "date", sortable: true, sort_direction: 'desc' }
    ],
    rowActions: [
      { label: "View", actionToPerform: "view", icon: "ri-eye-line" },
    ],
    data: [] as Withdrawal[],
    total: 0
  };
  
  constructor(private store: Store) {
    if(this.store.selectSnapshot(state => state.account.roleName === 'vendor')){
      this.store.dispatch(new GetVendorTransaction())
    }
  }

  ngOnInit() {
    this.withdrawal$.subscribe(withdrawal => { 
      let withdrawals = withdrawal?.data?.filter((element: Withdrawal) => {
        element.vendor_name = element?.user?.name;
        element.withdrawal_status = element.status ? `<div class="status-${element.status}"><span>${element.status.replace(/_/g, " ")}</span></div>` : '-';
        return element;
      });
      this.tableConfig.data = withdrawal ? withdrawals : [];
      this.tableConfig.total = withdrawal ? withdrawal?.total : 0;
    });
  }

  onActionClicked(action: TableClickedAction) {
    if(action.actionToPerform == 'view')
      this.PayoutModal.openModal(action.data);
  }

  onTableChange(data?: Params) { 
    this.store.dispatch(new GetWithdrawRequest(data));
  }

  approved(event: any) {
    this.store.dispatch(new UpdateWithdrawStatus(event.data.id, event.status));
  }
  
}
