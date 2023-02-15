import { DiscountTypes } from "app/globals";
import { User } from "./";

export class Discount {
	id: number;
	createdAt: Date;
	updatedAt: Date;
	locationId: number;
	type: DiscountTypes;
	value: number;
	clientId: number;
	used: boolean;
    note: string;
    client: User;
}
