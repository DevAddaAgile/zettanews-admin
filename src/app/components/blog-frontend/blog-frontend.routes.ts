import { Routes } from '@angular/router';
import { BlogListComponent } from './blog-list/blog-list.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';

export default [
  {
    path: '',
    component: BlogListComponent
  },
  {
    path: 'blog/:slug',
    component: BlogDetailComponent
  }
] as Routes;