import { Component, inject, Inject } from "@angular/core";
import { DOCUMENT, CommonModule } from "@angular/common";
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AccountUser } from "../../interface/account.interface";
import { AccountState } from '../../state/account.state';
import { NotificationState } from '../../state/notification.state';
import { NavService } from "../../services/nav.service";
import { Notification } from "../../interface/notification.interface";
import { SettingState } from "../../state/setting.state";
import { Values, Language } from "../../interface/setting.interface";
import { TranslateModule } from "@ngx-translate/core";
import { ProfileComponent } from "./widgets/profile/profile.component";
import { ModeComponent } from "./widgets/mode/mode.component";
import { NotificationComponent } from "./widgets/notification/notification.component";
import { LanguagesComponent } from "./widgets/languages/languages.component";

import { SearchComponent } from "./widgets/search/search.component";
import { RouterModule } from "@angular/router";

@Component({
    selector: "app-header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.scss"],
    imports: [
        RouterModule,
        SearchComponent,

        LanguagesComponent,
        NotificationComponent,
        ModeComponent,
        ProfileComponent,
        CommonModule,
        TranslateModule
    ]
})
export class HeaderComponent {

  user$: Observable<AccountUser> = inject(Store).select(AccountState.user);
  setting$: Observable<Values | null> = inject(Store).select(SettingState.setting);
  notification$: Observable<Notification[]> = inject(Store).select(NotificationState.notification);

  public unreadNotificationCount: number;

  public active: boolean = false;
  public profileOpen: boolean = false;
  public open: boolean = false;
  public showColorPicker: boolean = false;
  public direction: string = 'ltr';
  public currentColor: string = '#0d6efd';

  public languages: Language[] = [
    {
      language: 'English',
      code: 'en',
      icon: 'us'
    },
    {
      language: 'Français',
      code: 'fr',
      icon: 'fr'
    },
  ];

  public selectedLanguage: Language = {
    language: 'English',
    code: 'en',
    icon: 'us'
  }

  constructor(@Inject(DOCUMENT) private document: Document,
  public navServices: NavService ) {
    this.notification$.subscribe((notification) => {
      this.unreadNotificationCount = notification?.filter(item => !item.read_at)?.length;
    });
    this.setting$.subscribe(setting => {
      document.body.classList.add(setting?.general?.mode!);
    });
    
    // Load saved preferences
    if (typeof localStorage !== 'undefined') {
      const savedDirection = localStorage.getItem('direction') || 'ltr';
      this.direction = savedDirection;
      this.document.documentElement.setAttribute('dir', savedDirection);
      
      const savedColor = localStorage.getItem('themeColor') || '#0d6efd';
      this.currentColor = savedColor;
      this.document.documentElement.style.setProperty('--theme-color', savedColor);
    }
  }

  sidebarToggle() {
    this.navServices.collapseSidebar = !this.navServices.collapseSidebar;
  }

  clickHeaderOnMobile(){
    this.navServices.search = true;
  }

  toggleColorPicker() {
    this.showColorPicker = !this.showColorPicker;
  }

  changeColor(color: string) {
    this.document.documentElement.style.setProperty('--theme-color', color);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('themeColor', color);
    }
    this.showColorPicker = false;
  }

  changeDirection(dir: string) {
    this.direction = dir;
    this.document.documentElement.setAttribute('dir', dir);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('direction', dir);
    }
    this.showColorPicker = false;
  }

  onColorChange(event: Event) {
    const color = (event.target as HTMLInputElement).value;
    this.currentColor = color;
    this.changeColor(color);
  }

}
