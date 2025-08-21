import { Component } from '@angular/core';
import { FormFaqComponent } from '../form-faq/form-faq.component';
import { PageWrapperComponent } from '../../../shared/components/page-wrapper/page-wrapper.component';

@Component({
    selector: 'app-edit-faq',
    templateUrl: './edit-faq.component.html',
    styleUrls: ['./edit-faq.component.scss'],
    imports: [PageWrapperComponent, FormFaqComponent]
})
export class EditFaqComponent {
}
