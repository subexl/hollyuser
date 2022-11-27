import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'environments/environment';
import { User } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

    constructor(private http: HttpClient) { }

    updateAvatar( id: number, avatar: string):Observable  <User>{
        return this.http.patch<User>(`${environment.apiBaseUrl}clients/${id}`, { avatar });
    }
}
