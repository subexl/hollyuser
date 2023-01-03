import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import {Observable } from 'rxjs';
import { Location, Cube, CubeOrder, NetopiaRequest, GateAccess } from '../_models';

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

    getOrder(id:number): Observable<CubeOrder> {
        return this.http.get<CubeOrder>(environment.apiBaseUrl + `clients/order/${id}`);
    }

    loadPDF(path: string): Observable<any> {
        return this.http.get(environment.apiBaseUrl + path, {
          responseType : 'blob'
        });
    }


    // TEMP usage only for testing
    scanForEntry(gateId:number, entryCode: string): Observable<GateAccess> {
        return this.http.get<GateAccess>(environment.apiBaseUrl + `public/gateInAccess/${gateId}/${entryCode}`);
    }

    scanForExit(gateId:number, entryCode: string): Observable<GateAccess> {
        return this.http.get<GateAccess>(environment.apiBaseUrl + `public/gateOutAccess/${gateId}/${entryCode}`);
    }
    // TEMP usage only for testing


}
