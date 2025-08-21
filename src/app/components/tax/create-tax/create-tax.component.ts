import { Component } from '@angular/core';
import { FormTaxComponent } from '../form-tax/form-tax.component';
import { PageWrapperComponent } from '../../../shared/components/page-wrapper/page-wrapper.component';

@Component({
    selector: 'app-create-tax',
    templateUrl: './create-tax.component.html',
    styleUrls: ['./create-tax.component.scss'],
    imports: [PageWrapperComponent, FormTaxComponent]
})
export class CreateTaxComponent {

}
