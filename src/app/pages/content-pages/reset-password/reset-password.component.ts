import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MustMatch } from 'app/shared/directives/must-match.validator';
import { User } from 'app/shared/_models';
import { BasicService } from 'app/shared/_services';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

    correctCode = true;
    registerForm: FormGroup;
    registerFormSubmitted = false;
    client: User;
    code = '';
    passwordUpdated = false;

    constructor(private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private bService: BasicService,
        private router: Router) { }

    ngOnInit(): void {

        // check if we have reset code
        this.route.params
        .subscribe((params: Params) => {
            console.log(params);
            if('code' in params ){
                this.code = params.code;
                this.bService.getResetPasswordUser(params.code).subscribe( user => {
                    this.client = user;
                    this.initForm();
                }, err => {
                    this.correctCode = false;
                })
            } else {
               this.router.navigate(['/']);
            }
        });
    }

    initForm(){
        this.registerForm = this.formBuilder.group({
            password: ['', [Validators.required, Validators.minLength(4)]],
            confirmPassword: ['', Validators.required]
        }, {
        validator: MustMatch('password', 'confirmPassword')
        });
    }

    get rf() {
        return this.registerForm.controls;
    }

    onSubmitRegister() {
        this.bService.newPassword(this.code, this.registerForm.controls.password.value).subscribe(res => {
            if(res.msg == "account.passwordUpdated"){
                this.passwordUpdated = true;
            }
        })
    }

}
