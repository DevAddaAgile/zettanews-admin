import { Routes } from '@angular/router';

import { BerlinComponent } from './berlin/berlin.component';
import { DenverComponent } from './denver/denver.component';
import { MadridComponent } from './madrid/madrid.component';
import { OsakaComponent } from './osaka/osaka.component';
import { ParisComponent } from './paris/paris.component';
import { RomeComponent } from './rome/rome.component';
import { ThemeComponent } from './theme.component';
import { TokyoComponent } from './tokyo/tokyo.component';

export default [
  {
    path: '',
    component: ThemeComponent
  },
  {
    path: 'paris',
    component: ParisComponent
  },
  {
    path: 'tokyo',
    component: TokyoComponent
  },
  {
    path: 'osaka',
    component: OsakaComponent
  },
  {
    path: 'rome',
    component: RomeComponent
  },
  {
    path: 'madrid',
    component: MadridComponent
  },
  {
    path: 'berlin',
    component: BerlinComponent
  },
  {
    path: 'denver',
    component: DenverComponent
  }
] as Routes;

