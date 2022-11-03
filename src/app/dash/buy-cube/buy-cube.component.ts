import { Component, OnInit } from '@angular/core';

import { AuthService } from 'app/shared/auth/auth.service';
import { User } from 'app/shared/_models';
import { Cube, CubeOrder } from 'app/shared/_models/cube';
import { BasicService } from 'app/shared/_services';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-buy-cube',
    templateUrl: './buy-cube.component.html',
    styleUrls: ['./buy-cube.component.scss'],
})
export class BuyCubeComponent implements OnInit {
    currentUser: User;
    cubes: Cube[] = [];
    selectedCube: Cube;
    order: CubeOrder;

    constructor(private authService: AuthService,
        private spinner: NgxSpinnerService,
        private basicService: BasicService) {
        this.authService.currentUser.subscribe((user) => {
            this.currentUser = user;
        });
        this.currentUser = this.authService.currentUserValue;
        this.order = new CubeOrder(this.currentUser);
    }

    ngOnInit(): void {
        if(this.currentUser.remainingCubes){
            this.basicService.getComplementCubes().subscribe( cubes =>{
                this.cubes = cubes;
            })
        } else {
            this.basicService.getMainCubes().subscribe( cubes =>{
                this.cubes = cubes;
            })
        }
    }

    selectCube(cube:Cube){
        this.selectedCube = cube;
        this.order.selectCube(cube);
    }

    buyCube(){
        this.spinner.show();
        this.basicService.buyCubes(this.order).subscribe( order => {
            this.spinner.hide();
            // send to Netopia using order details
        }, err => {
            this.spinner.hide();
        });
    }

    onWeekendSwitch(event){
        setTimeout(() => {
            this.order.selectCube(this.selectedCube);
        }, 100);
    }
}
