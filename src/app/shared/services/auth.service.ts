import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../public/environments/environment";
import { AuthUserForgotModel, AuthUserStateModel, UpdatePasswordModel, VerifyEmailOtpModel } from "../interface/auth.interface";
import { UpdatePassword } from "../action/auth.action";

@Injectable({
  providedIn: "root",
})
export class AuthService {

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${environment.URL}/auth/login`, credentials);
  }

  register(userData: { email: string; password: string; name: string }): Observable<any> {
    return this.http.post(`${environment.URL}/auth/register`, userData);
  }

}
