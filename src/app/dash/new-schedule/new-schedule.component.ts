import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { LearningSession, User } from 'app/shared/_models';
import { SCHEDULE_END_HOUR, SCHEDULE_MINIMUM_HOURS, SCHEDULE_START_HOUR } from 'app/globals';
import { Moment } from 'moment';
import { NgSelectComponent } from '@ng-select/ng-select';
import { BasicService } from 'app/shared/_services';

// using weekendAccess as a global variable to be visible in filter function
let weekendAccess = false;

@Component({
  selector: 'app-new-schedule',
  templateUrl: './new-schedule.component.html',
  styleUrls: ['./new-schedule.component.scss']
})
export class NewScheduleComponent implements OnInit {

    @Input() currentUser: User;
    dataReady = false;
    session = new LearningSession();
    day;
    minDay: Moment;
    maxDay: Moment;
    min: Moment;
    max: Moment;
    start ;
    end;

    fromValues = [];
    untilValues = [];
    @ViewChild('untilSelect', { static: false}) untilSelect: NgSelectComponent;

    /**
     *
     * szombaton a program 9-14!!!!!!!!!!!!!!!!!!!!!!!!!!!!
     *
     */


    constructor(public activeModal: NgbActiveModal,
        private basicServ: BasicService) { }

    ngOnInit(): void {


        // set session basic info
        this.session.id = 0;
        this.session.locationId = this.currentUser.locationId;
        this.session.clientId = this.currentUser.id;

        // update global variable
        weekendAccess = this.currentUser.weekendAccess;
        // first let's set the max to users's expirations date
        this.maxDay = moment(this.currentUser.cubesExpireDate).startOf('day');

        // calculate minumim moment of start by using hours threshold
        this.min = moment().startOf('hour').add(SCHEDULE_MINIMUM_HOURS,'hours');

        // check if min if within today's closing time, if not, set min to next working day
        if(this.min.hour() >= SCHEDULE_END_HOUR ){
           this.min = moment().add(1,'day').startOf('day').add(SCHEDULE_START_HOUR, 'hours');
        }

        // need to set min date to beggining of the day for the datepicker to work
        this.minDay = moment(this.min).startOf('day');

        this.buildFromValues();

    }

    onFromSet($event){
        this.buildUntilValues();
    }


    buildFromValues(){
        // set minimum and maximum values for time inputs
        // if current min is before schedule start adjust it
        if(this.min.hour() < SCHEDULE_START_HOUR){
            this.min.hour(SCHEDULE_START_HOUR);
        }

        // first let's set the max to 'min' + maxDailyHours
        this.max = moment(this.min).add(this.currentUser.maxDailyHours,'hours');

        // if new max is over the schedule end adjust
        if(this.max.hour() > SCHEDULE_END_HOUR){
            this.max.hour(SCHEDULE_END_HOUR);
        }

        // now we have inital max and min let's build selectable hours
        this.fromValues = [];
        let fromMin = moment(this.min);

        do{
            this.fromValues.push(fromMin.format('HH:mm'));
            fromMin.add(30, 'minutes');
        } while (fromMin.hours() < SCHEDULE_END_HOUR - 1);
    }


    buildUntilValues(){
        console.log('buildUntilValues..', this.start);

        this.untilValues = [];
        if(!this.start){
            return;
        }

        let [h, m] = this.start.split(':');
        let untilMin = moment(this.min).hours(+h + 1 ).minutes(m);

        do{
            this.untilValues.push(untilMin.format('HH:mm'));
            untilMin.add(30, 'minutes');
        } while (untilMin.hours() <= SCHEDULE_END_HOUR && (untilMin.hours() - parseInt(h) <= this.currentUser.maxDailyHours ));

        // if started with roun hours remove lat half hour
        if('00' === m){
            this.untilValues.pop();
        }

        // if end already has a value when start was chaged see if we still have the new 'end' value available and if not set the first value
        if(this.end && !this.untilValues.includes(this.end)){
            this.untilSelect.handleClearClick();
        }
    }



    onFormSubmit(){
        let [h, m] = this.start.split(':');
        let [eh, em] = this.end.split(':');

        this.session.start = moment(this.day).hours(h).minutes(m).toDate();
        this.session.end = moment(this.day).hours(eh).minutes(em).toDate();
        console.log(this.session);

        this.basicServ.createSession(this.session).subscribe(session => {
            this.activeModal.close(true);
        }, err => {
            console.log(err);
        })
    }


    public weekendFilter(d: Date): boolean {
        const day = d.getDay();
        // Prevent Saturday and Sunday from being selected.
        // If user has weekend access allow Saturday
        return weekendAccess ?
            day !== 0 :
            day !== 0 && day !== 6;
    }


}
