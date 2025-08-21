import { Routes } from '@angular/router';
import { Error404Component } from './errors/error404/error404.component';
import { ContentComponent } from './shared/components/layout/content/content.component';
import { FullComponent } from './shared/components/layout/full/full.component';
import { full } from './shared/routes/full';
import { content } from './shared/routes/routes';
import { AuthGuard } from './core/guard/auth.guard';
import { UserComponent } from './components/user/user.component';

export const routes: Routes = [
  {
    path: "",
    redirectTo: "blog",
    pathMatch: "full",
  },
  {
    path: "auth",
    loadChildren: () => import("./components/auth/auth.routes"),
    canActivateChild: [AuthGuard],
  },
  {
    path: "",
    component: ContentComponent,  
    children: content,
  },
  {
    path: '',
    component: FullComponent,
    children: full,
  },
  {
    path: '**',
    pathMatch: 'full',
    component: Error404Component
  }
];
