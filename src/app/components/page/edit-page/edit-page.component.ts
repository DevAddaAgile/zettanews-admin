import { Component } from '@angular/core';
import { FormPageComponent } from '../form-page/form-page.component';
import { PageWrapperComponent } from '../../../shared/components/page-wrapper/page-wrapper.component';

@Component({
    selector: 'app-edit-page',
    templateUrl: './edit-page.component.html',
    styleUrls: ['./edit-page.component.scss'],
    imports: [PageWrapperComponent, FormPageComponent]
})
export class EditPageComponent {

}
