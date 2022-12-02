import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CubeOrdersComponent } from './cube-orders.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: CubeOrdersComponent
            }
      ]
    }
];



@NgModule({
  declarations: [
    CubeOrdersComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class CubeOrdersModule { }
