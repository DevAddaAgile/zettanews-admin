import { Component } from '@angular/core';
import { FormUserComponent } from '../form-user/form-user.component';
import { PageWrapperComponent } from '../../../shared/components/page-wrapper/page-wrapper.component';

@Component({
    selector: 'app-edit-user',
    templateUrl: './edit-user.component.html',
    styleUrls: ['./edit-user.component.scss'],
    imports: [PageWrapperComponent, FormUserComponent]
})
export class EditUserComponent {

}
