import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'environments/environment';
import {Observable } from 'rxjs';
import { Location, Cube, CubeOrder, NetopiaRequest, GateAccess, User, LearningSession, Discount } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class BasicService {

    public strings: any;

    constructor(private http: HttpClient, private translate: TranslateService) {
        console.log('BasicService loaded...');
        this.translate.getTranslation('ro').subscribe( s => {
            this.strings = s;
        });
    }

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

    resetPassword(email:string): Observable<any> {
        return this.http.get<any>(environment.apiBaseUrl + `public/resetPassword/${email}`);
    }

    getResetPasswordUser(code:string): Observable<User> {
        return this.http.get<User>(environment.apiBaseUrl + `public/getResetPasswordUser/${code}`);
    }
    newPassword( code: string, newPassword:string):Observable<any>{
        return this.http.patch<any>(`${environment.apiBaseUrl}public/newPassword/${code}`, { newPassword });
    }


    loadSheduledSession(clientId:number): Observable<LearningSession> {
        return this.http.get<LearningSession>(environment.apiBaseUrl + `sessions/scheduledForClient/${clientId}`);
    }

    deleteSession(id: number): Observable<any> {
        return this.http.delete<any>(environment.apiBaseUrl + `sessions/${id}`);
    }

    createSession(session: LearningSession): Observable<LearningSession> {
        return this.http.post<LearningSession>(environment.apiBaseUrl + `sessions/add`, session);
    }

    updateSession(session: LearningSession): Observable<LearningSession> {
        return this.http.patch<LearningSession>(environment.apiBaseUrl + `sessions/update`, session);
    }


    // discounts
    getDiscounts(clientId:number, used = ''): Observable<Discount[]> {
        return this.http.get<Discount[]>(environment.apiBaseUrl + `discounts/forClient/${clientId}/` + used );
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
