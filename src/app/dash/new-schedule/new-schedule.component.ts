import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { LearningSession, User } from 'app/shared/_models';
import { SCHEDULE_END_HOUR, SCHEDULE_END_HOUR_WEEKEND, SCHEDULE_MINIMUM_HOURS, SCHEDULE_START_HOUR, SCHEDULE_START_HOUR_WEEKEND, YMDHis } from 'app/globals';
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
    @Input() session: LearningSession;
    day: Date;
    minStart = moment();
    minDay: Moment;
    maxDay: Moment;
    min: Moment;
    max: Moment;
    start ;
    end;
    scheduleStart = SCHEDULE_START_HOUR;
    scheduleEnd = SCHEDULE_END_HOUR;

    fromValues = [];
    untilValues = [];
    @ViewChild('untilSelect', { static: false}) untilSelect: NgSelectComponent;
    @ViewChild('fromSelect', { static: false}) fromSelect: NgSelectComponent;

    /**
     *
     * szombaton a program 9-14!!!!!!!!!!!!!!!!!!!!!!!!!!!!
     *
     */


    constructor(public activeModal: NgbActiveModal,
        private basicServ: BasicService) { }

    ngOnInit(): void {
        // creating a new
        if(null === this.session){
            this.session = new LearningSession();
            // set session basic info
            this.session.id = 0;
            this.session.locationId = this.currentUser.locationId;
            this.session.clientId = this.currentUser.id;
        } else {
            // modifying existing, so need to set input values
            this.day = moment(this.session.start).startOf('day').toDate();

            if(this.day.getDay() == 6){
                this.scheduleStart = SCHEDULE_START_HOUR_WEEKEND;
                this.scheduleEnd = SCHEDULE_END_HOUR_WEEKEND;
            } else {
                this.scheduleStart = SCHEDULE_START_HOUR;
                this.scheduleEnd = SCHEDULE_END_HOUR;
            }

            this.buildFromValues();
            this.start = moment(this.session.start).format('HH:mm');
            this.buildUntilValues();
            this.end = moment(this.session.end).format('HH:mm');
        }

        // update global variable
        weekendAccess = this.currentUser.weekendAccess;

        // set min and max selectable days
        // first let's set the max to users's expirations date
        this.maxDay = moment(this.currentUser.cubesExpireDate).startOf('day');

        // calculate minumim moment of start by using hours threshold
        this.minStart = moment().startOf('hour').add(SCHEDULE_MINIMUM_HOURS + 1,'hours');

        // check if min if within today's closing time, if not, set min to next working day
        // need to set min date to beggining of the day for the datepicker to work
        if(this.minStart.isSameOrAfter(moment().startOf('hour').hours(this.scheduleEnd)) ){
            this.minDay = moment().add(1,'day').startOf('day');
        } else {
            this.minDay = moment().startOf('day');
        }
    }

    onFromSet($event){
        this.buildUntilValues();
    }


    buildFromValues(){
        // start by using start hours
        this.min = moment(this.day).hours(this.scheduleStart);
        // check if nem minimum is in past
        if(this.min.isBefore(this.minStart)){
            this.min = moment(this.minStart);
        }


        // check if min if within today's closing time, if not, set min to next working day
        if(this.min.hour() >= this.scheduleEnd ){
           this.min = moment().add(1,'day').startOf('day').add(this.scheduleStart, 'hours');
        }
        // set minimum and maximum values for time inputs
        // if current min is before schedule start adjust it
        if(this.min.hour() < this.scheduleStart){
            this.min.hour(this.scheduleStart);
        }

        // first let's set the max to 'min' + maxDailyHours
        this.max = moment(this.min).add(this.currentUser.maxDailyHours,'hours');

        // if new max is over the schedule end adjust
        if(this.max.hour() > this.scheduleEnd){
            this.max.hour(this.scheduleEnd);
        }

        // now we have inital max and min let's build selectable hours
        this.fromValues = [];
        let fromMin = moment(this.min);

        do{
            this.fromValues.push(fromMin.format('HH:mm'));
            fromMin.add(30, 'minutes');
        } while (fromMin.hours() < this.scheduleEnd - 1);
        // add last value manially
        this.fromValues.push(fromMin.format('HH:mm'));

        // if start already has a value check if it's valid
        if(this.start && this.fromSelect && !this.fromValues.includes(this.start)){
            this.fromSelect.handleClearClick();
        }
    }


    buildUntilValues(){

        this.untilValues = [];
        if(!this.start){
            return;
        }

        let [h, m] = this.start.split(':');
        let untilMin = moment(this.min).hours(+h + 1 ).minutes(m);

        do{
            this.untilValues.push(untilMin.format('HH:mm'));
            untilMin.add(30, 'minutes');
        } while (untilMin.hours() <= this.scheduleEnd && (untilMin.hours() - parseInt(h) <= this.currentUser.maxDailyHours ));

        // if started with roun hours remove lat half hour
        if('00' === m){
            this.untilValues.pop();
        }

        // if end already has a value when start was chaged see if we still have the new 'end' value available and if not set the first value
        if(this.end && !this.untilValues.includes(this.end)){
            this.untilSelect.handleClearClick();
        }
    }


    onDaySelected(){

        // set schedule hours based on day on the week
        // saturday has differens schedule
        if(this.day.getDay() == 6){
            this.scheduleStart = SCHEDULE_START_HOUR_WEEKEND;
            this.scheduleEnd = SCHEDULE_END_HOUR_WEEKEND;
        } else {
            this.scheduleStart = SCHEDULE_START_HOUR;
            this.scheduleEnd = SCHEDULE_END_HOUR;
        }

        this.buildFromValues();
        this.buildUntilValues();
    }

    onFormSubmit(){
        let [h, m] = this.start.split(':');
        let [eh, em] = this.end.split(':');

        this.session.start = moment(this.day).hours(h).minutes(m).toDate();
        this.session.end = moment(this.day).hours(eh).minutes(em).toDate();

        if(this.session.id !== 0){
            this.basicServ.updateSession(this.session).subscribe(session => {
                this.activeModal.close(true);
            }, err => {
                console.log(err);
            })
        } else {
            this.basicServ.createSession(this.session).subscribe(session => {
                this.activeModal.close(true);
            }, err => {
                console.log(err);
            })
        }

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
