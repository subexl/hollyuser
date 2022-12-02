import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AuthService } from 'app/shared/auth/auth.service';
import { CubeOrder, User } from 'app/shared/_models';
import { BasicService } from 'app/shared/_services';
import { DeviceDetectorService } from 'ngx-device-detector';
import Swal from 'sweetalert2';

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
    isMobile = false;
    isTablet = false;

    constructor(
        private route: ActivatedRoute,
        private authService: AuthService,
        private device: DeviceDetectorService,
        private basicService: BasicService) {



    }

    ngOnInit(): void {

        // check if we have orderId param from payment processor
        this.route.queryParams
        .subscribe((params: Params) => {
            if('orderId' in params ){
                let order = this.basicService.getOrder(params.orderId).subscribe( order => {
                    switch(order.status){
                        case 'PAID':
                            Swal.fire('Plata procesata cu succes!','Va multumim! Codul QR este activat!','success')
                        break;
                        case 'PENDING':
                            Swal.fire('Plata in procesare!','<strong>Va multumim!</strong><br><small>Contul va fi actualizat odata ce plata a fost incasata!</small>','info')
                        break;
                        case 'FAILED':
                            Swal.fire('Plata esuata!','<strong>Ne pare rău, dar plata nu afost efectuată cu succes!</strong><br><small>Vă rugăm încercați din nou</small>','error')
                        break;
                    }
                }, err => {
                    console.log(err);
                });
            }
        })

        this.isMobile = this.device.isMobile();
        this.isTablet = this.device.isTablet();
        this.authService.reloadUser();
        this.basicService.getOrders(this.currentUser.id).subscribe( orders => {
            this.orders = orders;
        });
    }

}
