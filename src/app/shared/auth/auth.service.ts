import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { RouteInfo, User } from '../_models';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'environments/environment';

@Injectable()
export class AuthService {
    public currentLocationId: number;
    public currentUser: Observable<User>;
    private currentUserSubject: BehaviorSubject<User>;

    constructor(public router: Router, private http: HttpClient) {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        this.currentUserSubject = new BehaviorSubject<User>(
            new User(user)
        );
        this.currentUser = this.currentUserSubject.asObservable();
        if(this.currentUserValue) {
            this.currentLocationId = this.currentUserValue.locationId;
        }
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }


    signinUser(username: string, password: string) {
        return this.http
        .post<any>(environment.apiBaseUrl + `auth/clientLogin`, {username, password})
        .pipe(
            map(async user => {
                // store user details and basic auth credentials in local storage to keep user logged in between page refreshes
                const { avatar,signature, ...payload } = user;
                localStorage.setItem('currentUser', JSON.stringify(payload));


                this.currentUserSubject.next(new User(user));
                // load db data
                this.loadDBData();
                return user;
            })
        );

    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }


    loadDBData(){
          // load db data
          this.http.get<any>(environment.apiBaseUrl + 'loadDBData').subscribe(data => {
            const roles = {};
            const locations = {};
            Object.keys(data.roles).map((key) => roles[data.roles[key].id] = data.roles[key]);
            Object.keys(data.locations).map((key) => locations[data.locations[key].id] = data.locations[key]);

            const dbData = {
                roles,
                locations,
                CandidateStatusesList: data.CandidateStatusesList,
                CandidateStatusesJSON: data.CandidateStatusesJSON
            }

            localStorage.setItem('dbData', JSON.stringify(dbData));

        })
    }


    getUserMenu():RouteInfo[] {
        const routes:RouteInfo[] = [
            {
                path: '/dash', title: 'Dashboard', icon: 'ft-home', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: []
            },{
                path: '/account', title: 'Contul meu', icon: 'ft-user', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: []
            },
            {
                path: '/orders', title: 'Istoric comenzi', icon: 'ft-list', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: []
            }
        ];

        return routes;
    }

    async reloadUser() {
        const user = await this.http.get<User>(environment.apiBaseUrl + `auth/reload/` +  this.currentUserValue.email).toPromise();
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(new User(user));
    }

    updatePassword( id: number, oldPassword: string, newPassword:string):Observable<any>{
        return this.http.patch<any>(`${environment.apiBaseUrl}clients/updatePassword/${id}`, { oldPassword, newPassword });
    }

    updateUserData( user: User):Observable<User>{
        return this.http.patch<User>(`${environment.apiBaseUrl}clients/${user.id}`, user);
    }


}
