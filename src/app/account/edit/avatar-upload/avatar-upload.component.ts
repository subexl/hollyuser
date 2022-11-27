import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'app/shared/auth/auth.service';
import { User } from 'app/shared/_models';
import { UsersService } from 'app/shared/_services';
import { ImageCroppedEvent  } from 'ngx-image-cropper';

@Component({
  selector: 'app-avatar-upload',
  templateUrl: './avatar-upload.component.html',
  styleUrls: ['./avatar-upload.component.scss']
})
export class AvatarUploadComponent implements OnInit {

    @Input() client: User;
    imageChangedEvent: any = '';
    croppedImage: any = '';
    file: File;
    loading = false;
    @ViewChild('fileInput',{ static: true}) fileInput :  ElementRef;


    constructor(private authService: AuthService,
        public activeModal: NgbActiveModal,
        private userService: UsersService) { }

    ngOnInit(): void {
        this.fileInput.nativeElement.click();
    }

    fileChangeEvent(event: any): void {
        this.imageChangedEvent = event;
        this.loading = true;
    }
    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64;
        console.log('Image cropped..');
    }

    imageLoaded() {
        this.loading = false;
    }

    cropperReady() {
       this.loading = false;
    }
    loadImageFailed() {
        this.loading = false;
    }

    uploadavatar() {
        this.userService.updateAvatar(this.client.id, this.croppedImage).subscribe( client => {
            if (client) {
                this.activeModal.close(true);
                this.client.avatar = client.avatar;
                localStorage.setItem('currentUser', JSON.stringify(this.client));
            }
        });
    }

}
