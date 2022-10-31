import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashComponent } from './dash.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: DashComponent,
            },
        ],
    },
];

@NgModule({
    declarations: [DashComponent],
    imports: [CommonModule, RouterModule.forChild(routes)],
})
export class DashModule {}
