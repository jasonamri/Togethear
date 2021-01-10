import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpClient,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { SpotifyService } from './spotify.service';
import { environment } from 'src/environments/environment';
import { stringify } from 'querystring';



@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private http: HttpClient,
    private spotify: SpotifyService
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(catchError((err, caught) => {
      //if refresh token error
      if (err.status === 401 && err.error.error.message == "The access token expired") {
        console.log("Refreshing Token");
        const refresh_token = this.spotify.getRefreshToken()

        const headers = {
          'Authorization': 'Basic ' + btoa(environment.client_id + ':' + environment.client_secret),
          'Content-Type': 'application/x-www-form-urlencoded'
        }

        const body = {
          refresh_token: refresh_token,
          grant_type: 'refresh_token'
        }

        return this.http.post<any>('https://accounts.spotify.com/api/token', stringify(body), { headers, observe: 'response' }).pipe(switchMap(response => {
          if (response.status === 200) {
            //set new access token for future requests  
            this.spotify.setTokens(response.body.access_token, refresh_token);
            // resend the request with new access_token
            const authReqRepeat = request.clone({
              headers: new HttpHeaders({
                'Authorization': 'Bearer ' + response.body.access_token
              })
            });
            return next.handle(authReqRepeat);
          }
          return next.handle(request);
        }));
      } else {
        //not a refresh token error, fall through
        return next.handle(request);
      }
    }));
  }
}