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

                localStorage.setItem('currentUser', JSON.stringify(user));


                this.currentUserSubject.next(new User(user));

                // // set session timeout
                localStorage.setItem(
                    'sessionTimeout',
                    (
                        new Date().getTime() + environment.sessionTimeout
                    ).toString()
                );

                // load db data
                this.loadDBData();
                return user;
            })
        );

    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        localStorage.removeItem('sessionTimeout');
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
                path: '/account', title: 'Account', icon: 'ft-user', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: []
            }
        ];

        return routes;
    }

    getClient(id:number) {
        return this.http.get<User>(environment.apiBaseUrl + `clients/` +  id);
    }


}
