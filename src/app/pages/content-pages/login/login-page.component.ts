import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router} from "@angular/router";
import { AuthService } from 'app/shared/auth/auth.service';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})

export class LoginPageComponent {

  loginFormSubmitted = false;
  isLoginFailed = false;

  loginForm = new FormGroup({
    username: new FormControl('subalevi@gmail.com', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    rememberMe: new FormControl(true)
  });


  constructor(private router: Router,
    private authService: AuthService,
    private spinner: NgxSpinnerService) {
  }

  get lf() {
    return this.loginForm.controls;
  }

  // On submit button click
  onSubmit() {
    this.loginFormSubmitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    this.spinner.show();

    this.authService.signinUser(this.loginForm.value.username, this.loginForm.value.password)
      .subscribe((res) => {
        this.spinner.hide();
        this.router.navigate(['/dash']);
      },
      (err) => {
        this.isLoginFailed = true;
        this.spinner.hide();
        console.log('error: ' + err)
      });
  }

}
