import { Component } from '@angular/core';
import { FormBlogComponent } from '../form-blog/form-blog.component';
import { PageWrapperComponent } from '../../../shared/components/page-wrapper/page-wrapper.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-blog',
  templateUrl: './edit-blog.component.html',
  styleUrls: ['./edit-blog.component.scss'],
  imports: [PageWrapperComponent, FormBlogComponent, TranslateModule]
})
export class EditBlogComponent {

}