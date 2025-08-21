import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';


@Component({
    selector: 'app-form-fields',
    templateUrl: './form-fields.component.html',
    styleUrls: ['./form-fields.component.scss'],
    imports: [TranslateModule]
})
export class FormFieldsComponent {

  @Input() class: string = "mb-4 row align-items-center g-2";
  @Input() label: string;
  @Input() labelClass: string = "form-label-title col-sm-2 mb-0";
  @Input() gridClass: string = "col-sm-10";
  @Input() for: string;
  @Input() required: Boolean;

}
