import { Component, inject, Input } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { LoaderState } from '../../state/loader.state';
import { TranslateModule } from '@ngx-translate/core';
import { LoaderComponent } from '../loader/loader.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-page-wrapper',
    templateUrl: './page-wrapper.component.html',
    styleUrls: ['./page-wrapper.component.scss'],
    imports: [LoaderComponent, CommonModule, TranslateModule]
})
export class PageWrapperComponent {

  @Input() public title: string;
  @Input() public grid: boolean = true;
  @Input() public gridClass: string = 'col-xxl-8 col-xl-10 m-auto';

  loadingStatus$: Observable<boolean> = inject(Store).select(LoaderState.status) as Observable<boolean>;

}
