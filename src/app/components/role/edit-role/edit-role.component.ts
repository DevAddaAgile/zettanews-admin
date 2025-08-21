import { Component } from '@angular/core';
import { FormRoleComponent } from '../form-role/form-role.component';
import { PageWrapperComponent } from '../../../shared/components/page-wrapper/page-wrapper.component';

@Component({
    selector: 'app-edit-role',
    templateUrl: './edit-role.component.html',
    styleUrls: ['./edit-role.component.scss'],
    imports: [PageWrapperComponent, FormRoleComponent]
})
export class EditRoleComponent {

}
