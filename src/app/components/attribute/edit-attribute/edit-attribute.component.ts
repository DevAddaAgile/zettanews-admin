import { Component } from '@angular/core';
import { FormAttributeComponent } from '../form-attribute/form-attribute.component';
import { PageWrapperComponent } from '../../../shared/components/page-wrapper/page-wrapper.component';

@Component({
    selector: 'app-edit-attribute',
    templateUrl: './edit-attribute.component.html',
    styleUrls: ['./edit-attribute.component.scss'],
    imports: [PageWrapperComponent, FormAttributeComponent]
})
export class EditAttributeComponent {

}
