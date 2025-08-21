import { Component } from '@angular/core';
import { FormAttributeComponent } from '../form-attribute/form-attribute.component';
import { PageWrapperComponent } from '../../../shared/components/page-wrapper/page-wrapper.component';

@Component({
    selector: 'app-create-attribute',
    templateUrl: './create-attribute.component.html',
    styleUrls: ['./create-attribute.component.scss'],
    imports: [PageWrapperComponent, FormAttributeComponent]
})
export class CreateAttributeComponent {

}
