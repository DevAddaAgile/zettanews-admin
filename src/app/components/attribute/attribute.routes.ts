import { Routes } from '@angular/router';

import { AttributeComponent } from './attribute.component';
import { CreateAttributeComponent } from './create-attribute/create-attribute.component';
import { EditAttributeComponent } from './edit-attribute/edit-attribute.component';

export default[
  {
    path: "",
    component: AttributeComponent
  },
  {
    path: "create",
    component: CreateAttributeComponent
  },
  {
    path: "edit/:id",
    component: EditAttributeComponent
  }
] as Routes;

