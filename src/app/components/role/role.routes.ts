import { Routes } from "@angular/router";

import { CreateRoleComponent } from './create-role/create-role.component';
import { EditRoleComponent } from './edit-role/edit-role.component';
import { RoleComponent } from './role.component';

export default[
  {
    path: "",
    component: RoleComponent
  },
  {
    path: "create",
    component: CreateRoleComponent
  },
  {
    path: "edit/:id",
    component: EditRoleComponent
  }
] as Routes;

