import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashComponent } from './dash.component';
import { RouterModule, Routes } from '@angular/router';
import { BuyCubeComponent } from './buy-cube/buy-cube.component';
import { SharedModule } from 'app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: DashComponent,
            },
            {
                path: 'dash',
                component: DashComponent,
            },
            {
                path: 'dash/buycube',
                component: BuyCubeComponent,
            },
        ],
    },
];

@NgModule({
    declarations: [DashComponent, BuyCubeComponent],
    imports: [
        TranslateModule,
        CommonModule,
        SharedModule,
        RouterModule.forChild(routes)
    ]
})
export class DashModule {}
