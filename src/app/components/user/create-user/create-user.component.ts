import { Component } from '@angular/core';
import { FormUserComponent } from '../form-user/form-user.component';
import { PageWrapperComponent } from '../../../shared/components/page-wrapper/page-wrapper.component';

@Component({
    selector: 'app-create-user',
    templateUrl: './create-user.component.html',
    styleUrls: ['./create-user.component.scss'],
    imports: [PageWrapperComponent, FormUserComponent]
})
export class CreateUserComponent {

}
