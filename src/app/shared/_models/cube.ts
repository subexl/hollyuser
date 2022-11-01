export interface Cube{
    id: number;
	cubeCount: number;
	maxDailyHours: number;
	weekDaysPrice: number;
	weekEndPrice: number;
	isComplement: boolean;
}

export interface CubeOrder{
    clientId: number;
	cubeId: number;
	price: number;
	cubeCount: number;
	weekendAccess: boolean;
}

export class CubeOrder implements CubeOrder {
    constructor( clientId: number){
        this.clientId = clientId;
        this.weekendAccess = false;
    }

    selectCube(cube: Cube){
        this.cubeId = cube.id;
        this.price = this.weekendAccess ? cube.weekEndPrice : cube.weekDaysPrice;
        this.cubeCount = cube.cubeCount;
    }
}

