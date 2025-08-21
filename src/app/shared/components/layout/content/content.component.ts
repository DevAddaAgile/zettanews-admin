import { Component, Inject, PLATFORM_ID } from "@angular/core";
import { Store } from "@ngxs/store";
import { NavService } from "../../../services/nav.service";
import { GetNotification } from './../../../action/notification.action';
import { GetBadges } from './../../../action/menu.action';
import { GetUserDetails } from './../../../action/account.action';
import { FooterComponent } from "../../footer/footer.component";
import { RouterModule } from "@angular/router";
import { SidebarComponent } from "../../sidebar/sidebar.component";
import { SidebarMenuSkeletonComponent } from "../../ui/skeleton/sidebar-menu-skeleton/sidebar-menu-skeleton.component";
import { HeaderComponent } from "../../header/header.component";
import { isPlatformBrowser } from "@angular/common";

@Component({
    selector: "app-content",
    templateUrl: "./content.component.html",
    styleUrls: ["./content.component.scss"],
    imports: [
        HeaderComponent,
        SidebarMenuSkeletonComponent,
        SidebarComponent,
        RouterModule,
        FooterComponent,
    ]
})
export class ContentComponent {

  public isBrowser: boolean;

  constructor(private store: Store,
    public navServices: NavService, @Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.store.dispatch(new GetBadges());
    this.store.dispatch(new GetNotification());
    this.store.dispatch(new GetUserDetails()).subscribe({
      complete: () => {
        this.navServices.sidebarLoading = false;
      }
    });
  }
  

}
