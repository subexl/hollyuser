import { CalendarEvent } from "angular-calendar/modules/calendar.module";
import { format, parseISO } from "date-fns";
import { User } from "./user";

export interface LearningSession extends CalendarEvent{
    locationId: number;
    clientId:number;
    client?: User;
}

export class LearningSession implements LearningSession{
    constructor(session?: LearningSession){
        if(null !== session){
            for(const key in session){
                this[key] = session[key];
            }
        }

        // convert dates
        this.start = parseISO(this.start?.toString());
        this.end = parseISO(this.end?.toString());
    }
}
