import { Component } from '@angular/core';
import { FormTaxComponent } from '../form-tax/form-tax.component';
import { PageWrapperComponent } from '../../../shared/components/page-wrapper/page-wrapper.component';

@Component({
    selector: 'app-edit-tax',
    templateUrl: './edit-tax.component.html',
    styleUrls: ['./edit-tax.component.scss'],
    imports: [PageWrapperComponent, FormTaxComponent]
})
export class EditTaxComponent {

}
