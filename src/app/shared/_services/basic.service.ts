import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { Location, User } from '../_models';
import { EmailTemplate } from '../_models/email-template';

@Injectable({
  providedIn: 'root'
})
export class BasicService {

    constructor(private http: HttpClient) { }

    getAllLocations(): Observable<Location[]> {
        return this.http.get<Location[]>(environment.apiBaseUrl + `locations`);
    }

    getAllUsers(): Observable<User[]> {
        return this.http.get<User[]>(environment.apiBaseUrl + `users`);
    }

    addUser(user:User): Observable<User> {
        return this.http.post<User>(environment.apiBaseUrl + `users/register`, user);
    }

    updateUser(user: User): Observable<User> {
        return this.http.patch<User>(environment.apiBaseUrl + `users/update`, user);
    }

    deleteUser(id: number): Observable<any> {
        return this.http.delete<any>(environment.apiBaseUrl + `users/${id}`);
    }

    getLocationUsers(locationId: number): Observable<User[]> {
        return this.http.get<User[]>(environment.apiBaseUrl + `users/from_location/${locationId}`);
    }

    addEmailTemplate(template: EmailTemplate): Observable<EmailTemplate> {
        return this.http.post<EmailTemplate>(environment.apiBaseUrl + `emails/add`, template);
    }

    updateEmailTemplate(template: EmailTemplate): Observable<EmailTemplate> {
        return this.http.patch<EmailTemplate>(environment.apiBaseUrl + `emails/${template.id}` , template);
    }

    getEmailTemplate(id: number): Observable<EmailTemplate> {
        return this.http.get<EmailTemplate>(environment.apiBaseUrl + `emails/${id}`);
    }

    getEmailTemplates(): Observable<EmailTemplate[]> {
        return this.http.get<EmailTemplate[]>(environment.apiBaseUrl + `emails`);
    }

    deleteEmailTemplate(id: number): Observable<any> {
        return this.http.delete<any>(environment.apiBaseUrl + `emails/${id}`);
    }
}
