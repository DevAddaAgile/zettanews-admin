import { Component, inject } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SettingState } from '../../state/setting.state';
import { Values } from '../../interface/setting.interface';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    imports: [CommonModule]
})
export class FooterComponent {

  setting$: Observable<Values | null> = inject(Store).select(SettingState.setting);

}
