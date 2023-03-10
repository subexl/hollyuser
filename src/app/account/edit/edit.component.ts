import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from 'app/shared/auth/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

import { User } from 'app/shared/_models';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

    client: User;
    initialValue: User; //used to restore
    @Output() notify = new EventEmitter();

    constructor(private authService: AuthService,
        private spinner: NgxSpinnerService) {
            this.spinner.show();
            this.authService.currentUser.subscribe( user => {
                this.client = user;
                this.initialValue = JSON.parse(JSON.stringify(user));
            });
            this.client = this.authService.currentUserValue;
            this.initialValue = JSON.parse(JSON.stringify(this.client));
    }

    ngOnInit(): void {
        this.spinner.hide();
    }

    onFormSubmit(){
        this.authService.updateUserData(this.client).
        subscribe( user => {
            this.notify.emit(true);
            this.initialValue = JSON.parse(JSON.stringify(this.client));
        }, err => {
            console.log(err);
            this.notify.emit(false);
        })
    }

    restoreForm(){
        for(const key in this.initialValue){
            this.client[key] = this.initialValue[key];
        }
    }

}
