import { CommonModule, DatePipe, isPlatformBrowser } from '@angular/common';
import { Component, Inject, inject, PLATFORM_ID } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { GetNotification, MarkAsReadNotification } from '../../shared/action/notification.action';
import { PageWrapperComponent } from '../../shared/components/page-wrapper/page-wrapper.component';
import { Notification } from "../../shared/interface/notification.interface";
import { NotificationState } from '../../shared/state/notification.state';

@Component({
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss'],
    imports: [PageWrapperComponent, CommonModule, DatePipe]
})
export class NotificationComponent {

  notification$: Observable<Notification[]> = inject(Store).select(NotificationState.notification);

  constructor(private store: Store, @Inject(PLATFORM_ID) private platformId: Object) {
    this.store.dispatch(new GetNotification());
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      this.store.dispatch(new MarkAsReadNotification());
    }
  }

}
