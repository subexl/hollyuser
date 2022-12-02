import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgSelectModule } from '@ng-select/ng-select';

import { ContentPagesRoutingModule } from "./content-pages-routing.module";

import { ErrorPageComponent } from "./error/error-page.component";
import { LoginPageComponent } from "./login/login-page.component";
import { RegisterPageComponent } from './register/register-page.component';
import { SignupComponent } from './signup/signup.component';
import { SharedModule } from 'app/shared/shared.module';
import { RegisterSelectComponent } from './register-select/register-select.component';
import { SignupSuccessComponent } from './signup/signup-success/signup-success.component';
import { AngularSignaturePadModule } from '@almothafar/angular-signature-pad';


@NgModule({
    imports: [
        CommonModule,
        ContentPagesRoutingModule,
        FormsModule ,
        ReactiveFormsModule,
        NgbModule,
        NgxSpinnerModule,
        NgSelectModule,
        AngularSignaturePadModule,
        SharedModule
    ],
    declarations: [
        ErrorPageComponent,
        LoginPageComponent,
        RegisterPageComponent,
        SignupComponent,
        RegisterSelectComponent,
        SignupSuccessComponent
    ]
})
export class ContentPagesModule { }
