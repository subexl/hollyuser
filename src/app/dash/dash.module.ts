import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashComponent } from './dash.component';
import { RouterModule, Routes } from '@angular/router';
import { BuyCubeComponent } from './buy-cube/buy-cube.component';
import { SharedModule } from 'app/shared/shared.module';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: DashComponent,
            },
            {
                path: 'buycube',
                component: BuyCubeComponent,
            },
        ],
    },
];

@NgModule({
    declarations: [DashComponent, BuyCubeComponent],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(routes)
    ]
})
export class DashModule {}
