import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { OpenDay, User } from '../_models';
import { Candidate } from '../_models/candidate';

@Injectable({
  providedIn: 'root'
})
export class CandidatesService {

    constructor(private http: HttpClient) { }


    addCandidate(candidate: Candidate): Observable<Candidate> {
        return this.http.post<Candidate>(environment.apiBaseUrl + `public/candidates/signup`, candidate);
    }

    resetCandidate(email: string, scheduledDate: string): Observable<Candidate> {
        return this.http.patch<Candidate>(environment.apiBaseUrl + `public/candidates/reset`, { email, scheduledDate});
    }

    getCandidate(email: string): Observable<Candidate> {
        return this.http.get<Candidate>(environment.apiBaseUrl + `public/candidates/` +   email);
    }

    getOpendays(locationId: number): Observable<OpenDay[]> {
        return this.http.get<OpenDay[]>(environment.apiBaseUrl + `public/openDays/` +   locationId);
    }

    createClient(user: User): Observable<User> {
        return this.http.post<User>(environment.apiBaseUrl + `public/addClient`, user);
    }


}
