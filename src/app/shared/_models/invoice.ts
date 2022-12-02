import { CubeOrder } from "./cube";

export interface Invoice {
    id: number;
    clientId: number;
    createdAt: Date;
    prefix: string;
    index: number;
    items: CubeOrder[];
    locationId: number;
    value: number;
}
