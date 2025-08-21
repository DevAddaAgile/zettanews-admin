import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-error403',
    templateUrl: './error403.component.html',
    styleUrls: ['./error403.component.scss'],
    imports: [RouterModule, TranslateModule]
})
export class Error403Component {

  constructor(private location: Location) {}

  back() {
    this.location.back();
  }
  
}
