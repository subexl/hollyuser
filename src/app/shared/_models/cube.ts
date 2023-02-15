import { OrderStatus } from "app/globals";
import { Discount, Invoice, User } from "./";

export interface Cube{
    id: number;
	cubeCount: number;
	cubeCountWeekend: number;
	maxDailyHours: number;
	weekDaysPrice: number;
	weekEndPrice: number;
	isComplement: boolean;
}

export interface CubeOrder{
    id: number;
    locationId: number;
    clientId: number;
    client: User;
	cubeId: number;
	price: number;
    markdown: number;
	cubeCount: number;
	weekendAccess: boolean;
    createdAt: Date;
    status: OrderStatus;
    invoice: Invoice;
    discountId: number;
    discount: Discount;
}

export class CubeOrder implements CubeOrder {
    constructor( client: User){
        this.clientId = client.id;
        this.locationId = client.locationId;
        this.weekendAccess = false;
        this.status = OrderStatus.PENDING;
        this.markdown = 0;
    }

    selectCube(cube: Cube){
        this.cubeId = cube.id;
        this.price = this.weekendAccess ? cube.weekEndPrice : cube.weekDaysPrice;
        this.cubeCount = this.weekendAccess ? cube.cubeCountWeekend :  cube.cubeCount;
        this.markdown = 0;
    }


    applyDiscount(discount: Discount){
        let discountValue = discount.type == 'FIXED' ?
        discount.value : Math.round(this.price * discount.value / 100);

        this.markdown +=  parseFloat(discountValue.toString());
        // will not work correctly if more than 1 discounts are used
        this.discountId = discount.id;
    }

    getTotal(){
        return this.price - this.markdown;
    }
}

