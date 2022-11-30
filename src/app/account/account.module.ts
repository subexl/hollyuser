import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ToastrService } from 'ngx-toastr';

import { SharedModule } from 'app/shared/shared.module';

import { AccountComponent } from './account.component';
import { EditComponent } from './edit/edit.component';
import { AvatarUploadComponent } from './edit/avatar-upload/avatar-upload.component';
import { EditInvoiceInfoComponent } from './edit-invoice-info/edit-invoice-info.component';
import { NgSelectModule } from '@ng-select/ng-select';

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
    AvatarUploadComponent,
    EditInvoiceInfoComponent
  ],
  imports: [
    SharedModule,
    NgSelectModule,
    ImageCropperModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  providers:[
    ToastrService,
    AvatarUploadComponent
  ]
})
export class AccountModule { }
