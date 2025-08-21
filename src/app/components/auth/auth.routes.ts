import { Routes } from "@angular/router";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { LoginComponent } from "./login/login.component";
import { OtpComponent } from "./otp/otp.component";
import { UpdatePasswordComponent } from "./update-password/update-password.component";

export default [
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "forgot-password",
    component: ForgotPasswordComponent,
  },
  {
    path: "otp",
    component: OtpComponent,
  },
  {
    path: "update-password",
    component: UpdatePasswordComponent,
  }
] as Routes;

