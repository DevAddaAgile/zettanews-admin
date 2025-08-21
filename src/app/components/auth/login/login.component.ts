import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { Login } from '../../../shared/action/auth.action';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { AlertComponent } from '../../../shared/components/ui/alert/alert.component';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [
        AlertComponent,
        ReactiveFormsModule,
        RouterModule,
        TranslateModule,
        ButtonComponent,
    ]
})
export class LoginComponent {

  public form: FormGroup;

  constructor(
    private store: Store,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      email: new FormControl('admin@example.com', [Validators.required, Validators.email]),
      password: new FormControl('123456789', [Validators.required]),
    });
  }

  submit() {
    this.form.markAllAsTouched();
    if(this.form.valid) {
      this.store.dispatch(new Login(this.form.value)).subscribe({
          complete: () => { 
            this.router.navigateByUrl('/dashboard'); 
          }     
        }
      );
    }
  }
  
}
