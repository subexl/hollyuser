import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/shared/auth/auth.service';
import { User } from 'app/shared/_models';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

    client: User;
    initialValue: User; //used to restore

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

    }

    restoreForm(){
        for(const key in this.initialValue){
            this.client[key] = this.initialValue[key];
        }
    }

}
