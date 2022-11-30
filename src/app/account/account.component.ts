import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from 'app/shared/auth/auth.service';
import { MustMatch } from 'app/shared/directives/must-match.validator';
import { User } from 'app/shared/_models';
import { AvatarUploadComponent } from './edit/avatar-upload/avatar-upload.component';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {

    client: User;
    activeTab = "general";
    changePasswordFormSubmitted = false;

    changePasswordForm = this.formBuilder.group({
        oldPassword: new FormControl('', [Validators.required, Validators.minLength(4)]),
        newPassword: new FormControl('', [Validators.required, Validators.minLength(4)]),
        retypeNewPassword: new FormControl('', [Validators.required])
      }, {
        validator: MustMatch('newPassword', 'retypeNewPassword')
      });

    constructor(private authService: AuthService,
        private translate: TranslateService,
        public toastr: ToastrService,
        private modalService: NgbModal,
        private formBuilder: FormBuilder,
        private spinner: NgxSpinnerService) {
            this.spinner.show();
            this.authService.currentUser.subscribe( user => {
                this.client = user;
            });
            this.client = this.authService.currentUserValue;
    }

    ngOnInit(): void {

        this.spinner.hide();
    }

    get cpf() {
        return this.changePasswordForm.controls;
    }

    setActiveTab(tab) {
        this.activeTab = tab;
    }

    openUploader(){
        const modalRef = this.modalService.open(AvatarUploadComponent, { size: 'lg',  centered: true });
        modalRef.componentInstance.client = this.client;
        modalRef.closed.subscribe((wasUploaded)=>{
            if(true === wasUploaded){
                this.translate.get(['account.avatarUploaded']).subscribe(strings => {
                    this.toastr.success(strings['account.avatarUploaded']);
                })
            }
        });
    }

    onChangePasswordFormSubmit() {
        this.changePasswordFormSubmitted = true;
        if (this.changePasswordForm.invalid) {
          return;
        }

        this.authService.updatePassword(this.client.id, this.changePasswordForm.controls['oldPassword'].value, this.changePasswordForm.controls['newPassword'].value).subscribe( res => {
            if(res.msg == 'account.passwordUpdated'){
                this.translate.get(['account.passwordUpdated']).subscribe(strings => {
                    this.toastr.success(strings['account.passwordUpdated']);
                })
            } else {
                this.translate.get(['account.oldPasswordWrong']).subscribe(strings => {
                    console.log(strings);
                    this.toastr.error(strings['account.oldPasswordWrong']);
                })
            }
        }, err => {
            console.log(err);
        })
    }


    ConfirmedValidator(controlName: string, matchingControlName: string) {
        return (formGroup: FormGroup) => {
          const control = formGroup.controls[controlName];
          const matchingControl = formGroup.controls[matchingControlName];
          if (
            matchingControl.errors &&
            !matchingControl.errors.confirmedValidator
          ) {
            return;
          }
          if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ confirmedValidator: true });
          } else {
            matchingControl.setErrors(null);
          }
        };
    }

    onDataUpdated(success: boolean){
        if(success){
            this.translate.get(['account.updated']).subscribe(strings => {
                this.toastr.success(strings['account.updated']);
            })
        } else {
            this.translate.get(['account.failed']).subscribe(strings => {
                console.log(strings);
                this.toastr.error(strings['account.failed']);
            })
        }
    }
}
