import { Injectable } from "@angular/core";
import { Store, State, Selector, Action, StateContext } from "@ngxs/store";
import { Router } from '@angular/router';
import { tap } from "rxjs/operators";
import { AuthService } from "../services/auth.service";
import { ForgotPassWord, Login, VerifyEmailOtp, UpdatePassword, Logout, AuthClear } from "../action/auth.action";
import { AccountClear } from "../action/account.action";
import { GetBadges } from "../action/menu.action";
import { GetSettingOption } from "../action/setting.action";
import { GetUsers } from "../action/user.action";
import { GetCountries } from "../action/country.action";
import { GetStates } from "../action/state.action";
import { GetNotification } from "../action/notification.action";
import { NotificationService } from "../services/notification.service";

export interface AuthStateModel {
  email: string;
  token: string | number;
  access_token: string | null;
  permissions: [];
}

@State<AuthStateModel>({
  name: "auth",
  defaults: {
    email: '',
    token: '',
    access_token: '',
    permissions: [],
  },
})
@Injectable()
export class AuthState {
  
  constructor(private store: Store,
    public router: Router,
    private notificationService: NotificationService,
    private authService: AuthService) {}

  ngxsOnInit(ctx: StateContext<AuthStateModel>) {
    if (typeof localStorage !== 'undefined') {
      const storedToken = localStorage.getItem('access_token');
      const storedEmail = localStorage.getItem('user_email');
      if (storedToken && storedEmail) {
        ctx.patchState({
          email: storedEmail,
          access_token: storedToken,
          permissions: []
        });
      }
    }
  }

  @Selector()
  static accessToken(state: AuthStateModel) {
    return state.access_token;
  }

  @Selector()
  static isAuthenticated(state: AuthStateModel) {
    return !!state.access_token;
  }

  @Selector()
  static email(state: AuthStateModel) {
    return state.email;
  }

  @Selector()
  static token(state: AuthStateModel) {
    return state.token;
  }

  @Action(Login)
  login(ctx: StateContext<AuthStateModel>, action: Login) {
    return this.authService.login(action.payload).pipe(
      tap({
        next: result => {
          ctx.patchState({
            email: result.user.email,
            access_token: result.token,
            permissions: []
          });
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem('access_token', result.token);
            localStorage.setItem('user_email', result.user.email);
          }
          window.location.href = `http://localhost:4201/blog?token=${result.token}`;
        },
        error: err => {
          throw new Error(err?.error?.message || 'Login failed');
        }
      })
    );
  }

  @Action(ForgotPassWord)
  forgotPassword(ctx: StateContext<AuthStateModel>, action: ForgotPassWord) {
    // Forgot Password Logic Here
  }

  @Action(VerifyEmailOtp)
  verifyEmail(ctx: StateContext<AuthStateModel>, action: VerifyEmailOtp) {
    // Verify Email Logic Here
  }

  @Action(UpdatePassword)
  updatePassword(ctx: StateContext<AuthStateModel>, action: UpdatePassword) {
    // Update Password Logic Here
  }

  @Action(Logout)
  logout(ctx: StateContext<AuthStateModel>) {
    ctx.patchState({
      email: '',
      token: '',
      access_token: null,
      permissions: []
    });
    this.router.navigate(['/auth/login']);
  }

  @Action(AuthClear)
  authClear(ctx: StateContext<AuthStateModel>){
    ctx.patchState({
      email: '',
      token: '',
      access_token: null,
      permissions: [],
    });
    this.store.dispatch(new AccountClear());
  }

}
