import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import {Observable } from 'rxjs';
import { Location, User, Cube, CubeOrder } from '../_models';

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

    buyCubes(order: CubeOrder): Observable<CubeOrder> {
        return this.http.post<CubeOrder>(environment.apiBaseUrl + `clients/buyCubes`, order);
    }

    // updateUser(user: User): Observable<User> {
    //     return this.http.patch<User>(environment.apiBaseUrl + `users/update`, user);
    // }

    // deleteUser(id: number): Observable<any> {
    //     return this.http.delete<any>(environment.apiBaseUrl + `users/${id}`);
    // }

}
