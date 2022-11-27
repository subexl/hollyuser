import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'app/shared/auth/auth.service';
import { User } from 'app/shared/_models';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AvatarUploadComponent } from './edit/avatar-upload/avatar-upload.component';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {

    client: User;
    activeTab = "general";

    constructor(private authService: AuthService,
        private translate: TranslateService,
        public toastr: ToastrService,
        private modalService: NgbModal,
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

    setActiveTab(tab) {
        this.activeTab = tab;
    }

    openUploader(){
        const modalRef = this.modalService.open(AvatarUploadComponent, { size: 'lg',  centered: true });
        modalRef.componentInstance.client = this.client;
        modalRef.closed.subscribe((wasUploaded)=>{
            if(true === wasUploaded){
                this.translate.get(['account.avatarUploaded']).subscribe(strings => {
                    this.toastr.success(strings.account.avatarUploaded);
                })
            }
        });
    }
}
