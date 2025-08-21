import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';


@Component({
    selector: 'app-no-data',
    templateUrl: './no-data.component.html',
    styleUrls: ['./no-data.component.scss'],
    imports: [TranslateModule]
})
export class NoDataComponent {

  @Input() class: string = "no-data-added";
  @Input() image: string;
  @Input() text: string;
  
}
