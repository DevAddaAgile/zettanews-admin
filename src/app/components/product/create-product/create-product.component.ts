import { Component } from '@angular/core';
import { FormProductComponent } from '../form-product/form-product.component';
import { PageWrapperComponent } from '../../../shared/components/page-wrapper/page-wrapper.component';

@Component({
    selector: 'app-create-product',
    templateUrl: './create-product.component.html',
    styleUrls: ['./create-product.component.scss'],
    imports: [PageWrapperComponent, FormProductComponent]
})
export class CreateProductComponent {

}
