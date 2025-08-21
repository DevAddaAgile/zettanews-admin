import { Component } from '@angular/core';
import { FormBlogComponent } from '../form-blog/form-blog.component';
import { PageWrapperComponent } from '../../../shared/components/page-wrapper/page-wrapper.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-create-blog',
    templateUrl: './create-blog.component.html',
    styleUrls: ['./create-blog.component.scss'],
    imports: [PageWrapperComponent, FormBlogComponent, TranslateModule]
})
export class CreateBlogComponent {

}
