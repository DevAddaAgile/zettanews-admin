  import { Component, inject, Inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SettingState } from './shared/state/setting.state';
import { Observable } from 'rxjs';
import { Values } from './shared/interface/setting.interface';
import { Actions, ofActionDispatched, Select, Store } from '@ngxs/store';
import { NgbNavConfig } from '@ng-bootstrap/ng-bootstrap';
import { DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { GetSettingOption } from './shared/action/setting.action';
import { Title } from '@angular/platform-browser';
import { Logout } from './shared/action/auth.action';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { GetCountries } from './shared/action/country.action';
import { GetStates } from './shared/action/state.action';

@Component({
    selector: 'app-root',
    imports: [RouterModule, LoadingBarRouterModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})

export class AppComponent {
  
  setting$: Observable<Values> = inject(Store).select(SettingState.setting);

  public favIcon: HTMLLinkElement | null;

  constructor(config: NgbNavConfig, 
    @Inject(DOCUMENT) document: Document,
    private actions: Actions, private router: Router,
    private titleService: Title, private store: Store,
    private translate: TranslateService) {
      this.translate.use('en');
      this.store.dispatch(new GetSettingOption());
      this.store.dispatch(new GetCountries());
      this.store.dispatch(new GetStates());
      this.setting$.subscribe(setting => {
        // Set Direction
        if(setting?.general?.admin_site_language_direction === 'rtl'){
          document.getElementsByTagName('html')[0].setAttribute('dir', 'rtl');
          document.body.classList.add('rtl');
        }else {
          document.getElementsByTagName('html')[0].removeAttribute('dir');
          document.body.classList.remove('rtl');
        }

        // Set Favicon
        this.favIcon = document.querySelector('#appIcon');
        this.favIcon!.href = <string>setting?.general?.favicon_image?.original_url;

        // Set site title
        this.titleService.setTitle(setting?.general?.site_title && setting?.general?.site_tagline ? 
          `${setting?.general?.site_title} | ${setting?.general?.site_tagline}` : 'FastKart Marketplace: Where Vendors Shine Together' )
      })

    // customize default values of navs used by this component tree
		config.destroyOnHide = false;
		config.roles = false;

    this.actions.pipe(ofActionDispatched(Logout)).subscribe(() => {
      this.router.navigate(['/auth/login']);
    });
  }


}
