import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UNUSED_DISCOUNTS } from 'app/globals';

import { AuthService } from 'app/shared/auth/auth.service';
import { Discount, NetopiaRequest, User } from 'app/shared/_models';
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
    discounts: Discount[] = [];
    request: NetopiaRequest;
    @ViewChild('cardPayment', { static : false}) public cardPayment: ElementRef;

    constructor(private authService: AuthService,
        private spinner: NgxSpinnerService,
        private basicService: BasicService) {
        this.authService.currentUser.subscribe((user) => {
            this.currentUser = user;
        });
        this.currentUser = this.authService.currentUserValue;
        this.order = new CubeOrder(this.currentUser);
    }

    async ngOnInit() {

        // load and autoappy discount(s)
        // only 1 discount us loaded, limit set at backend
        this.discounts = await this.basicService.getDiscounts(this.currentUser.id, UNUSED_DISCOUNTS).toPromise();


        // we allow all cubes to be bought as of 16-10-23
        // if(this.currentUser.remainingCubes){
        //     this.basicService.getComplementCubes().subscribe( cubes =>{
        //         this.cubes = cubes;
        //     })
        // } else {
            this.basicService.getMainCubes().subscribe( cubes =>{
                this.cubes = cubes;
            })
        // }
    }

    selectCube(cube:Cube){
        this.selectedCube = cube;
        // if buying complement cubes set the weeknd acces to users current acces, and hide input
        if(this.currentUser.remainingCubes){
            this.order.weekendAccess = this.currentUser.weekendAccess;
        }
        this.order.selectCube(this.selectedCube);
        this.discounts.map(discount => this.order.applyDiscount(discount));
    }

    buyCube(){
        this.spinner.show();
        this.basicService.buyCubes(this.order).subscribe( request => {
            // send to Netopia using order details
            try{
                this.request = request;
                setTimeout(() => {
                    this.cardPayment.nativeElement.submit();
                }, 100);
            } catch {
                this.spinner.hide();
            }
        }, err => {
            this.spinner.hide();
        });
    }

    onWeekendSwitch(event){
        setTimeout(() => {
            this.order.selectCube(this.selectedCube);
            this.discounts.map(discount => this.order.applyDiscount(discount));
        }, 100);
    }
}
