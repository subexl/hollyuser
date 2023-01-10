import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import * as moment from 'moment';

import { LearningSession, User } from 'app/shared/_models';
import { BasicService } from 'app/shared/_services';
import { AuthService } from 'app/shared/auth/auth.service';
import { CUBE_VALIDITY_DAYS, DEFAULT_GATE, SCHEDULE_MINIMUM_HOURS } from 'app/globals';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewScheduleComponent } from './new-schedule/new-schedule.component';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.scss']
})
export class DashComponent implements OnInit {

    qrCollapsed = true;
    currentUser: User;
    isMobile = false;
    isTablet = false;
    scheduledSession: LearningSession;

    constructor(
        public toastr: ToastrService,
        private route: ActivatedRoute,
        private authService: AuthService,
        private device: DeviceDetectorService,
        private modalService: NgbModal,
        private basicService: BasicService) {

        this.authService.currentUser.subscribe((user) => {
            this.currentUser = user;
        });
        this.currentUser = this.authService.currentUserValue;

    }

    ngOnInit(): void {

        // check if we have orderId param from payment processor
        this.route.queryParams
        .subscribe((params: Params) => {
            if('orderId' in params ){
                this.basicService.getOrder(params.orderId).subscribe( order => {
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

        this.loadSheduledSession();
    }


    /**
     * Load the clients scheduled date if exists
     */
    loadSheduledSession(){
            this.basicService.loadSheduledSession(this.currentUser.id).subscribe( session => {
                this.scheduledSession = session? new LearningSession(session) : null;
            }, err => {
                // no scheduled session
            });
    }

    getRemainingPercent(){
        const expireDate = moment(this.currentUser.cubesExpireDate);
        const today = moment();

        const remaining = expireDate.diff(today,'days');
        return remaining * 100 / CUBE_VALIDITY_DAYS;
    }


    /**
     * open modal for creating a new schedule
     */
    newSchedule(){
        const modalRef = this.modalService.open(NewScheduleComponent, { size: 'lg',  centered: true });
        modalRef.componentInstance.currentUser = this.currentUser;
        modalRef.closed.subscribe((wasAdded)=>{
            if(true === wasAdded){
                this.toastr.success(this.basicService.strings['dash.scheduleUpdated'],'', { positionClass: 'toast-bottom-center'})
                this.loadSheduledSession();
            }
        });
    }


    /**
     * Calculate if shcedule can be modified/cancelled
     */

    canChangeSchedule():boolean{
        if (!this.scheduledSession) return true;

        const start = moment(this.scheduledSession.start);
        const now = moment();

        const diff = start.diff(now,'hours');
        return diff >= SCHEDULE_MINIMUM_HOURS;
    }

    /**
     * Delete scheduled Session
     */
    async cancelSchedule(){
        if (!this.canChangeSchedule()) return;

        Swal.fire({
            title: this.basicService.strings.areYouSure,
            text: this.basicService.strings['dash.sessionWillBeLost'],
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            confirmButtonText: this.basicService.strings.yesDelete,
            cancelButtonText: this.basicService.strings.back
          }).then((result) => {
            if (result.isConfirmed) {
                this.basicService.deleteSession(+this.scheduledSession.id).subscribe(res => {
                    if(res.affected){
                        Swal.fire({
                            position: 'bottom',
                            icon: 'info',
                            title: this.basicService.strings['dash.scheduleDeleted'],
                            showConfirmButton: false,
                            toast:true,
                            timer: 2500
                        })
                        this.loadSheduledSession();
                    }
                })
            }
          })
    }





    /**
     * simulate scanning the qrcode for ENTRY at the gate
     */
    scanForEntry(){
        this.basicService.scanForEntry(DEFAULT_GATE,this.currentUser.entryCode).subscribe( scan =>{
            if(scan.access){
                this.toastr.success('Scanare intrare cu succes!');
            } else {
                this.toastr.error(scan.error, 'Scanare respinsa');
            }
        })
    }


     /**
     * simulate scanning the qrcode for EXIT at the gate
     */
    scanForExit(){
        this.basicService.scanForExit(DEFAULT_GATE,this.currentUser.entryCode).subscribe( scan =>{
            if(scan.access){
                this.toastr.success('Scanare iesire cu succes!');
            } else {
                this.toastr.error(scan.error, 'Scanare respinsa');
            }
        })
    }

}
