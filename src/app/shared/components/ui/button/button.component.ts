import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { LoaderState } from '../../../state/loader.state';

@Component({
    selector: 'app-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class ButtonComponent {

  @Input() class: string = 'btn btn-theme ms-auto mt-4';
  @Input() classData: string = 'btn btn-theme ms-auto mt-4';
  @Input() iconClass: string | null;
  @Input() id: string;
  @Input() label: string = 'Submit';
  @Input() type: string  = 'submit';
  @Input() spinner:  boolean = true;
  @Input() disabled: boolean = false;

  public buttonId: string | null;

  spinnerStatus$: Observable<boolean> = inject(Store).select(LoaderState.buttonSpinner) as Observable<boolean>;

  constructor() {
    this.spinnerStatus$.subscribe(res => {
      if(res == false) {
        this.buttonId = null;
      }
    });
  }

  public onClick(id: string): void {
    this.buttonId = id;
  }

}
