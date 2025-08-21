import { Component, inject } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Notification } from '../../../../../shared/interface/notification.interface';
import { NavService } from '../../../../../shared/services/nav.service';
import { NotificationState } from '../../../../../shared/state/notification.state';
import { SummaryPipe } from '../../../../pipe/summary.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { CommonModule, SlicePipe } from '@angular/common';

@Component({
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss'],
    imports: [RouterModule, CommonModule, SlicePipe, TranslateModule, SummaryPipe]
})
export class NotificationComponent {
  
  notification$: Observable<Notification[]> = inject(Store).select(NotificationState.notification);

  public unreadNotificationCount: number;
  public active: boolean = false;

  constructor( public navServices: NavService ) {
    this.notification$.subscribe((notification) => {
      this.unreadNotificationCount = notification?.filter(item => !item.read_at)?.length;
    });
  }

  clickHeaderOnMobile(){
    this.active= !this.active
  }
}
