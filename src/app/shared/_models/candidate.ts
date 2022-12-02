import { Location } from "./location";

export interface Candidate {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    createdAt: Date;
    location: Location;
    locationId: number
    status: number;
    statusName: string;
    lang: string;
    scheduledDate: Date;
    note: string;
}
