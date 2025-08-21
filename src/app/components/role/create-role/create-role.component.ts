import { Component } from '@angular/core';
import { FormRoleComponent } from '../form-role/form-role.component';
import { PageWrapperComponent } from '../../../shared/components/page-wrapper/page-wrapper.component';

@Component({
    selector: 'app-create-role',
    templateUrl: './create-role.component.html',
    styleUrls: ['./create-role.component.scss'],
    imports: [PageWrapperComponent, FormRoleComponent]
})
export class CreateRoleComponent {

}
