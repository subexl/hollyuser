import { OrderStatus } from "app/globals";
import { User } from "./user";

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
    clientId: number;
    locationId: number;
	cubeId: number;
	price: number;
	cubeCount: number;
	weekendAccess: boolean;
    status: OrderStatus;
}

export class CubeOrder implements CubeOrder {
    constructor( client: User){
        this.clientId = client.id;
        this.locationId = client.locationId;
        this.weekendAccess = false;
        this.status = OrderStatus.PENDING;
    }

    selectCube(cube: Cube){
        this.cubeId = cube.id;
        this.price = this.weekendAccess ? cube.weekEndPrice : cube.weekDaysPrice;
        this.cubeCount = this.weekendAccess ? cube.cubeCountWeekend :  cube.cubeCount;
    }
}

