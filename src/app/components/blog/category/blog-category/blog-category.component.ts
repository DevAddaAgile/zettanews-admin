import { Component } from '@angular/core';
import { CategoryComponent } from '../../../category/category.component';

@Component({
    selector: 'app-blog-category',
    templateUrl: './blog-category.component.html',
    styleUrls: ['./blog-category.component.scss'],
    imports: [CategoryComponent]
})
export class BlogCategoryComponent {

}
