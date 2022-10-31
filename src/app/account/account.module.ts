import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountComponent } from './account.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: AccountComponent
            }
      ]
    }
];

@NgModule({
  declarations: [
    AccountComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class AccountModule { }
