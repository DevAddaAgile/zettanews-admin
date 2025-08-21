import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-error404',
    templateUrl: './error404.component.html',
    styleUrls: ['./error404.component.scss'],
    imports: [TranslateModule]
})
export class Error404Component {

  constructor(private location: Location) {}

  back(){
    this.location.back();
  }
  
}
