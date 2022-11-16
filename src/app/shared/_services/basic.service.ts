import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import {Observable } from 'rxjs';
import { Location, Cube, CubeOrder, NetopiaRequest } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class BasicService {

    constructor(private http: HttpClient) { }

    getAllLocations(): Observable<Location[]> {
        return this.http.get<Location[]>(environment.apiBaseUrl + `locations`);
    }

    getMainCubes(): Observable<Cube[]> {
        return this.http.get<Cube[]>(environment.apiBaseUrl + `clients/getMainCubes`);
    }

    getComplementCubes(): Observable<Cube[]> {
        return this.http.get<Cube[]>(environment.apiBaseUrl + `clients/getComplementCubes`);
    }

    buyCubes(order: CubeOrder): Observable<NetopiaRequest> {
        return this.http.post<NetopiaRequest>(environment.apiBaseUrl + `clients/buyCubes`, order);
    }

    getOrders(id:number): Observable<CubeOrder[]> {
        return this.http.get<CubeOrder[]>(environment.apiBaseUrl + `clients/orders/${id}`);
    }

    // deleteUser(id: number): Observable<any> {
    //     return this.http.delete<any>(environment.apiBaseUrl + `users/${id}`);
    // }

}
