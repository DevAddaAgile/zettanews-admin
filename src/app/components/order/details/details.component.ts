import { Component, inject, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, of } from 'rxjs';
import { Select2Data, Select2UpdateEvent, Select2Module } from 'ng-select2-component';
import { switchMap, mergeMap, takeUntil } from 'rxjs/operators';
import { ViewOrder } from '../../../shared/action/order.action';
import { UpdateOrderStatus } from '../../../shared/action/order.action';
import { GetOrderStatus } from '../../../shared/action/order-status.action';
import { OrderState } from '../../../shared/state/order.state';
import { OrderStatusState } from '../../../shared/state/order-status.state';
import { Order } from '../../../shared/interface/order.interface';
import { OrderStatus, OrderStatusModel } from '../../../shared/interface/order-status.interface';
import { CurrencySymbolPipe } from '../../../shared/pipe/currency-symbol.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { PageWrapperComponent } from '../../../shared/components/page-wrapper/page-wrapper.component';
import { NgClass, CommonModule, UpperCasePipe, TitleCasePipe, DatePipe, isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss'],
    imports: [NgClass, PageWrapperComponent, Select2Module, RouterModule, CommonModule, UpperCasePipe, TitleCasePipe, DatePipe, TranslateModule, CurrencySymbolPipe]
})
export class DetailsComponent {

  orderStatus$: Observable<OrderStatusModel> = inject(Store).select(OrderStatusState.orderStatus);
  orderStatuses$: Observable<Select2Data> = inject(Store).select(OrderStatusState.orderStatuses) as Observable<Select2Data>;

  public order: Order;
  public statuses: OrderStatus[] = [];
  public isBrowser: boolean;

  private destroy$ = new Subject<void>();

  constructor(private store: Store,
    private route: ActivatedRoute, @Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.store.dispatch(new GetOrderStatus());
  }

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap(params => {
            if(!params['id']) return of();
            return this.store
                      .dispatch(new ViewOrder(params['id']))
                      .pipe(mergeMap(() => this.store.select(OrderState.selectedOrder)))
          }
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(order => {
        this.order = order!
      });
  }

  updateOrderStatus(data: Select2UpdateEvent) {
    if(data && data?.value) {
      this.store.dispatch(new UpdateOrderStatus(this.order?.id!, { order_status_id: Number(data?.value) }));
    }
  }

  ngOnDestroy() {
    this.statuses = [];
    this.destroy$.next();
    this.destroy$.complete();

  }

}
