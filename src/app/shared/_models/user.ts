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
    source: string;
    address: string;
    county: string;
    city: string;
    avatar: string;
    remainingCubes: number;
    weekendAccess: boolean;
    invoicedFirstName: string;
    invoicedLastName: string;
    invoicedToOther: boolean;
    qrcode: string;
    signature: string;
    token?: string;
    password?: string;
}


export class User implements User{
    constructor( values?: User){
        if(values){
            for(const i in values){
                this[i] = values[i];
            }
        }
    }

    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }

    getQrCodeData(){
        return this.id.toString();
    }
}
