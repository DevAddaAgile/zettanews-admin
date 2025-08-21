import { Routes } from '@angular/router';

import { CreateUserComponent } from './create-user/create-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { UserComponent } from './user.component';

export default[
  {
    path: "",
    component: UserComponent
  },
  {
    path: "create",
    component: CreateUserComponent
  },
  {
    path: "edit/:id",
    component: EditUserComponent
  }
] as Routes;

