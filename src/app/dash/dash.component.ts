import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/shared/auth/auth.service';
import { CubeOrder, User } from 'app/shared/_models';
import { BasicService } from 'app/shared/_services';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.scss']
})
export class DashComponent implements OnInit {

    qrCollapsed = true;
    currentUser: User;
    percent = 0;
    orders: CubeOrder[] = [];

    constructor(private authService: AuthService,
        private basicService: BasicService) {
        this.authService.currentUser.subscribe((user) => {
            this.currentUser = user;
        });
        this.currentUser = this.authService.currentUserValue;
    }

    ngOnInit(): void {
        this.authService.reloadUser();
        this.basicService.getOrders(this.currentUser.id).subscribe( orders => {
            this.orders = orders;
        });
    }

}
