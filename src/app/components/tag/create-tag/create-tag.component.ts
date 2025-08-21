import { Component, Input } from '@angular/core';
import { FormTagComponent } from '../form-tag/form-tag.component';
import { PageWrapperComponent } from '../../../shared/components/page-wrapper/page-wrapper.component';

@Component({
    selector: 'app-create-tag',
    templateUrl: './create-tag.component.html',
    styleUrls: ['./create-tag.component.scss'],
    imports: [PageWrapperComponent, FormTagComponent]
})
export class CreateTagComponent {

  @Input() tagType: string | null = 'product';

}
