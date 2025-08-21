import { Routes } from '@angular/router';

import { CreateProductComponent } from './create-product/create-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { ProductComponent } from './product.component';

export default [
  {
    path: "",
    component: ProductComponent
  },
  {
    path: "create",
    component: CreateProductComponent
  },
  {
    path: "edit/:id",
    component: EditProductComponent
  }
] as Routes;
