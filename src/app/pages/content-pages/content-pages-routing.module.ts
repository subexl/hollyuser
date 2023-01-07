import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ErrorPageComponent } from "./error/error-page.component";
import { ForgotPasswordPageComponent } from './forgot-password/forgot-password-page.component';
import { LoginPageComponent } from "./login/login-page.component";
import { RegisterSelectComponent } from './register-select/register-select.component';
import { RegisterPageComponent } from './register/register-page.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SignupSuccessComponent } from './signup/signup-success/signup-success.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  {
    path: '',
    children: [
    {
        path: '',
        component: ErrorPageComponent,
        data: {
            title: 'Error Page'
        }
        },
      {
        path: 'error',
        component: ErrorPageComponent,
        data: {
          title: 'Error Page'
        }
      },
      {
        path: 'login',
        component: LoginPageComponent,
        data: {
          title: 'Login Page'
        }
      },
      {
        path: 'register',
        component: RegisterPageComponent,
        data: {
          title: 'Register Page'
        }
      },
      {
        path: 'register-select',
        component: RegisterSelectComponent,
        data: {
          title: 'Select Registertration Type'
        }
      },
      {
        path: 'signup',
        component: SignupComponent,
        data: {
          title: 'Sign up for test'
        }
      },
      {
        path: 'signup-success',
        component: SignupSuccessComponent,
        data: {
          title: 'Sign up done'
        }
      },
      {
        path: 'forgotpassword',
        component: ForgotPasswordPageComponent,
        data: {
          title: 'Forgot Password Page'
        }
      },
      {
        path: 'resetPassword/:code',
        component: ResetPasswordComponent,
        data: {
          title: 'Reset Password Page'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContentPagesRoutingModule { }
