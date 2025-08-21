import { Component } from '@angular/core';
import { FormFaqComponent } from '../form-faq/form-faq.component';
import { PageWrapperComponent } from '../../../shared/components/page-wrapper/page-wrapper.component';

@Component({
    selector: 'app-create-faq',
    templateUrl: './create-faq.component.html',
    styleUrls: ['./create-faq.component.scss'],
    imports: [PageWrapperComponent, FormFaqComponent]
})
export class CreateFaqComponent {
}
