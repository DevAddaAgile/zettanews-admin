import { Routes } from '@angular/router';
import { Error403Component } from './error403/error403.component';

export default [
  {
    path: '',
    children: [
      {
        path: '403',
        component: Error403Component
      },
    ]
  }
] as Routes;

