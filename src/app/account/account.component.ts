import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/shared/auth/auth.service';
import { User } from 'app/shared/_models';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {

    client: User;

    constructor(private authService: AuthService,
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
}
