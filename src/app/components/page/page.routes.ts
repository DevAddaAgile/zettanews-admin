import { Routes } from '@angular/router';

import { CreatePageComponent } from './create-page/create-page.component';
import { EditPageComponent } from './edit-page/edit-page.component';
import { PageComponent } from './page.component';

export default[
  {
    path: "",
    component: PageComponent
  },
  {
    path: "create",
    component: CreatePageComponent
  },
  {
    path: "edit/:id",
    component: EditPageComponent
  }
] as Routes;
