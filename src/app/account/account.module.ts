import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ToastrService } from 'ngx-toastr';

import { SharedModule } from 'app/shared/shared.module';

import { AccountComponent } from './account.component';
import { EditComponent } from './edit/edit.component';
import { AvatarUploadComponent } from './edit/avatar-upload/avatar-upload.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: AccountComponent
            },
            {
                path: 'edit',
                component: EditComponent
            }
      ]
    }
];

@NgModule({
  declarations: [
    AccountComponent,
    EditComponent,
    AvatarUploadComponent
  ],
  imports: [
    SharedModule,
    ImageCropperModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  providers:[
    ToastrService,
    AvatarUploadComponent
  ]
})
export class AccountModule { }
