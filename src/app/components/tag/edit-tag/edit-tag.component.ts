import { Component, Input } from '@angular/core';
import { FormTagComponent } from '../form-tag/form-tag.component';
import { PageWrapperComponent } from '../../../shared/components/page-wrapper/page-wrapper.component';

@Component({
    selector: 'app-edit-tag',
    templateUrl: './edit-tag.component.html',
    styleUrls: ['./edit-tag.component.scss'],
    imports: [PageWrapperComponent, FormTagComponent]
})
export class EditTagComponent {

  @Input() tagType: string | null = 'product';

}
