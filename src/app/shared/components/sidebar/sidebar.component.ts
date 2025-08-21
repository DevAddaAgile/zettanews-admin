import { CommonModule, isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import { Component, inject, Inject, Input, PLATFORM_ID } from "@angular/core";
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { TranslateModule } from "@ngx-translate/core";
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { GetMenu } from "../../action/menu.action";
import { HasPermissionDirective } from "../../directive/has-permission.directive";
import { AccountUser } from "../../interface/account.interface";
import { Menu, MenuModel } from "../../interface/menu.interface";
import { Permission } from "../../interface/role.interface";
import { Values } from "../../interface/setting.interface";
import { NavService } from "../../services/nav.service";
import { AccountState } from '../../state/account.state';
import { MenuState } from "../../state/menu.state";
import { SettingState } from "../../state/setting.state";

@Component({
    selector: "app-sidebar",
    templateUrl: "./sidebar.component.html",
    styleUrls: ["./sidebar.component.scss"],
    imports: [
        RouterModule,
        NgTemplateOutlet,
        CommonModule,
        HasPermissionDirective,
        TranslateModule
    ]
})
export class SidebarComponent {
  
  @Input() class: string;
  
  user$: Observable<AccountUser> = inject(Store).select(AccountState.user);
  permissions$: Observable<Permission[]> = inject(Store).select(AccountState.permissions);
  setting$: Observable<Values | null> = inject(Store).select(SettingState.setting);
  menu$: Observable<MenuModel> = inject(Store).select(MenuState.menu);

  public item: Menu;
  public menuItems: Menu[] = [];
  public permissions: string[] = [];
  public sidebarTitleKey: string = 'sidebar';

  constructor(public navServices: NavService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router, 
    private store: Store) {
    this.store.dispatch(new GetMenu());
    this.menu$.subscribe((menuItems) => {
      this.menuItems = menuItems?.data;
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.menuItems?.forEach((menu: Menu) => {
              menu.active = false;
              this.activeMenuRecursive(menu, (event.url.split("?")[0].toString().split("/")[1].toString()));
          });
        }
      });
    });
  }

  hasMainLevelMenuPermission(acl_permission?: string[]) {
    let status = true;
    if(acl_permission?.length) {
      this.permissions$.subscribe(permission => {
        this.permissions = permission?.map((value: Permission) => value?.name);
        if(!acl_permission?.some(action => this.permissions?.includes(<any>action))) {
          status = false;
        }
      });
    }
    return status;
  }

  sidebarToggle() {
    this.navServices.collapseSidebar = !this.navServices.collapseSidebar;
  }
  
  onItemSelected(item: Menu, onRoute: boolean = false) {
    this.menuItems.forEach((menu: Menu) => {
      this.deActiveAllMenu(menu, item);
    });
    if(!onRoute)
      item.active = !item.active;
  }

  activeMenuRecursive(menu: Menu, url: string, item?: Menu) {
    if(menu && menu.path && menu.path == (url.charAt(0) !== '/' ? '/'+url : url)) {
      if(item) {
        item.active = true; 
        this.onItemSelected(item, true);
      }
      menu.active = true;
    }
    if(menu?.children?.length) {
      menu?.children.forEach((child: Menu) => {
        this.activeMenuRecursive(child, (url.charAt(0) !== '/' ? '/'+url : url.toString()), menu)
      })
    }
  }

  deActiveAllMenu(menu: Menu, item: Menu) {
    if(menu && menu.active && menu.id != item.id) {
      menu.active = false;
    }
    if(menu?.children?.length) {
      menu?.children.forEach((child: Menu) => {
        this.deActiveAllMenu(child, item)
      })
    }
  }

  closeSidebar(){
    if (isPlatformBrowser(this.platformId)) { // For SSR 
      if(window.innerWidth < 992){
        this.navServices.collapseSidebar = false;
      }
    }
  }
  
}
