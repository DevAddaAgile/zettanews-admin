import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { Store } from "@ngxs/store";
import { Router } from "@angular/router";
import { ForgotPassWord } from "../../../shared/action/auth.action";
import { TranslateModule } from "@ngx-translate/core";
import { ButtonComponent } from "../../../shared/components/ui/button/button.component";
import { AlertComponent } from "../../../shared/components/ui/alert/alert.component";

@Component({
    selector: "app-forgot-password",
    templateUrl: "./forgot-password.component.html",
    styleUrls: ["./forgot-password.component.scss"],
    imports: [
        AlertComponent,
        ReactiveFormsModule,
        ButtonComponent,
        TranslateModule,
    ]
})
export class ForgotPasswordComponent {

  public form: FormGroup;

  constructor(private store: Store, 
    public router: Router, 
    public formBuilder: FormBuilder ) {
    this.form = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]]
    });
  }

  submit() {
    this.form.markAllAsTouched();
    if(this.form.valid) {
      this.store.dispatch(new ForgotPassWord(this.form.value)).subscribe({
        complete: () => { 
          this.router.navigateByUrl('/auth/otp'); 
        }     
      });
    }
  }
}
