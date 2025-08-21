import { Component, Input } from '@angular/core';
import { CategoryComponent } from '../category.component';

@Component({
    selector: 'app-edit-category',
    templateUrl: './edit-category.component.html',
    styleUrls: ['./edit-category.component.scss'],
    imports: [CategoryComponent]
})
export class EditCategoryComponent {

  @Input() categoryType: string = 'product';

}
