import { Routes } from '@angular/router';

import { CreateStoreComponent } from './create-store/create-store.component';
import { EditStoreComponent } from './edit-store/edit-store.component';
import { StoreComponent } from './store.component';

export default [
  {
    path: "",
    component: StoreComponent
  },
  {
    path: "create",
    component: CreateStoreComponent
  },
  {
    path: "edit/:id",
    component: EditStoreComponent
  }
] as Routes;

