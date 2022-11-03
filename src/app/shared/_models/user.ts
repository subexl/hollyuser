export interface User {
    address: string;
    avatar: string;
    cnp: string;
    email: string;
    firstName: string;
    id: number;
    remainingCubes: number;
    weekendAccess: boolean;
    invoicedName: string;
    invoicedToOther: boolean;
    lang: string;
    locationId: number;
    phone?: string;
    qrcode: string;
    signature: string;
    lastName: string;
    source: string;
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
}
