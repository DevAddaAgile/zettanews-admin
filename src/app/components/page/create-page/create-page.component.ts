import { Component } from '@angular/core';
import { FormPageComponent } from '../form-page/form-page.component';
import { PageWrapperComponent } from '../../../shared/components/page-wrapper/page-wrapper.component';

@Component({
    selector: 'app-create-page',
    templateUrl: './create-page.component.html',
    styleUrls: ['./create-page.component.scss'],
    imports: [PageWrapperComponent, FormPageComponent]
})
export class CreatePageComponent {

}
