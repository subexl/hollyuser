import { Component, OnInit, ViewChild } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { DeviceDetectorService } from 'ngx-device-detector';

import { AuthService } from 'app/shared/auth/auth.service';
import { CubeOrder, Invoice, User } from 'app/shared/_models';
import { BasicService } from 'app/shared/_services';

@Component({
  selector: 'app-cube-orders',
  templateUrl: './cube-orders.component.html',
  styleUrls: ['./cube-orders.component.scss']
})
export class CubeOrdersComponent implements OnInit {

    @ViewChild(DatatableComponent) table: DatatableComponent;
    columnMode = ColumnMode.force;
    orders: CubeOrder[] = [];
    sort = [{ prop: 'createdAt', dir: 'desc' }];
    currentUser: User;
    loadingIndicator = true;

    constructor(
        private basicService: BasicService,
        private authService: AuthService,
        private device: DeviceDetectorService,
    ) {
        this.authService.currentUser.subscribe((user) => {
            this.currentUser = user;
        });
        this.currentUser = this.authService.currentUserValue;
     }

    ngOnInit(): void {
        if(this.device.isMobile()){
            this.columnMode = ColumnMode.standard;
        }
        this.loadOrders();
    }

    loadOrders(){
        this.basicService.getOrders(this.currentUser.id).subscribe( orders => {
            this.orders = orders;
            this.loadingIndicator = false;
            setTimeout(() => {
                if(this.device.isMobile()){
                    this.table.rowDetail.expandAllRows();
                }
            }, 100);
        }, err => {
            this.loadingIndicator = false;
        });
    }

    openInvoice(invoice: Invoice){
        this.basicService.loadPDF(`clients/invoice/${invoice.id}`).subscribe(
            (response) => {
                    const  blob = new Blob([response], {type: 'application/pdf'});
                    const blobUrl = URL.createObjectURL(blob);
                    window.open(blobUrl,'_blank','width: 800');
        });
    }

}
