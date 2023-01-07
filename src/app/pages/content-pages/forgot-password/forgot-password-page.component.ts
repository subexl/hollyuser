import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BasicService } from 'app/shared/_services';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-forgot-password-page',
    templateUrl: './forgot-password-page.component.html',
    styleUrls: ['./forgot-password-page.component.scss']
})

export class ForgotPasswordPageComponent {
    email = '';
    resetDone = false;

    constructor(private spinner: NgxSpinnerService,
        private translate: TranslateService,
        private bService: BasicService,
        public toastr: ToastrService) { }

    // On submit click, reset form fields
    onSubmit() {
        this.spinner.show();
        this.bService.resetPassword(this.email).subscribe( resp => {
            this.resetDone = true;
            this.spinner.hide();
        }, err => {
            this.translate.get(['account.invalidEmail']).subscribe(strings => {
                this.toastr.error(strings['account.invalidEmail'],'',{ positionClass: "toast-bottom-center"});
            })
            this.spinner.hide();
        });

    }


}
