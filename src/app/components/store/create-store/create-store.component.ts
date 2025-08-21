import { Component } from '@angular/core';
import { FormStoreComponent } from '../form-store/form-store.component';
import { PageWrapperComponent } from '../../../shared/components/page-wrapper/page-wrapper.component';

@Component({
    selector: 'app-create-store',
    templateUrl: './create-store.component.html',
    styleUrls: ['./create-store.component.scss'],
    imports: [PageWrapperComponent, FormStoreComponent]
})
export class CreateStoreComponent {

}
