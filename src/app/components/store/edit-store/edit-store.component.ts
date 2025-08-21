import { Component } from '@angular/core';
import { FormStoreComponent } from '../form-store/form-store.component';
import { PageWrapperComponent } from '../../../shared/components/page-wrapper/page-wrapper.component';

@Component({
    selector: 'app-edit-store',
    templateUrl: './edit-store.component.html',
    styleUrls: ['./edit-store.component.scss'],
    imports: [PageWrapperComponent, FormStoreComponent]
})
export class EditStoreComponent {

}
