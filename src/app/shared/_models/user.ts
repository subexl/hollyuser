import { Candidate } from "./candidate";
import { Location } from "./location";
export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    cnp: string;
    createdAt: Date;
    updatedAt: Date;
    lastEntry: Date;
    locationId: number;
    location?: Location;
    lang: string;
    note?: string;
    source: string;
    address: string;
    county: string;
    city: string;
    avatar: string;
    remainingCubes: number;
    weekendAccess: boolean;
    maxDailyHours: number;
    invoicedFirstName: string;
    invoicedLastName: string;
    invoicedToOther: boolean;
    invoicedToCompany: boolean;
    companyJ: string;
    qrcode: string;
    entryCode: string;
    signature: string;
    token?: string;
    password?: string;
    cubesExpireDate: Date;
}


export class User implements User{
    constructor( values?: User){
        if(values){
            for(const i in values){
                this[i] = values[i];
            }
        }

        this.invoicedToOther = this.invoicedToOther || false;
        this.source = this.source || 'online';
    }

    createFromCandidate(candidate: Candidate){
        this.firstName = candidate.firstName;
        this.lastName = candidate.lastName;
        this.email = candidate.email;
        this.phone = candidate.phone;
        this.locationId = candidate.locationId;
        this.lang = candidate.lang;
        this.entryCode = candidate.entryCode;
        this.note = candidate.note || '';
        this.signature = '';
        this.avatar = '';
        this.invoicedFirstName = '';
        this.invoicedLastName = '';
    }

    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }

    getQrCodeData(){
        return this.entryCode.toString();
    }
}
