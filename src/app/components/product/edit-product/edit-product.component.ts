import { Component } from '@angular/core';
import { FormProductComponent } from '../form-product/form-product.component';
import { PageWrapperComponent } from '../../../shared/components/page-wrapper/page-wrapper.component';

@Component({
    selector: 'app-edit-product',
    templateUrl: './edit-product.component.html',
    styleUrls: ['./edit-product.component.scss'],
    imports: [PageWrapperComponent, FormProductComponent]
})
export class EditProductComponent {

}
