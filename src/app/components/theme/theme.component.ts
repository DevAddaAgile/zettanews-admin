import { Component, inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ConfirmationModalComponent } from "../../shared/components/ui/modal/confirmation-modal/confirmation-modal.component";
import { GetThemes, UpdateTheme } from '../../shared/action/theme.action';
import { Themes, ThemesModel } from '../../shared/interface/theme.interface';
import { ThemeState } from '../../shared/state/theme.state';
import { TranslateModule } from '@ngx-translate/core';
import { HasPermissionDirective } from '../../shared/directive/has-permission.directive';
import { CommonModule } from '@angular/common';
import { PageWrapperComponent } from '../../shared/components/page-wrapper/page-wrapper.component';

@Component({
    selector: 'app-theme',
    templateUrl: './theme.component.html',
    styleUrls: ['./theme.component.scss'],
    imports: [PageWrapperComponent, HasPermissionDirective, ConfirmationModalComponent, CommonModule, TranslateModule]
})

export class ThemeComponent {

  public themes: Themes[]
  public selectedTheme: number | null;

  themes$: Observable<ThemesModel> = inject(Store).select(ThemeState.themes) as Observable<ThemesModel>;

  @ViewChild("confirmationModal") ConfirmationModal: ConfirmationModalComponent;

  constructor(private store: Store, private router: Router) { }

  ngOnInit() {
    this.store.dispatch(new GetThemes())
    this.themes$.subscribe(item => {
      item?.data?.map((data:Themes)=> {
        if(data.status === 1) this.selectedTheme = data.id;
      })
    })
  }

  themeRoute(route: string) {
    this.router.navigateByUrl(`/theme/${route}`)
  }

  activeTheme(theme: any) {
    this.selectedTheme = null;
    this.selectedTheme = theme.data.id!;
    this.store.dispatch(new UpdateTheme(theme.data.id, 1));
  }

}
