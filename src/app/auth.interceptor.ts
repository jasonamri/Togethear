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
        return this.http.get<any>("https://togethear.jasonamri.com/refresh_token?refresh_token="+refresh_token).pipe(switchMap(data => {
          //set new access token for future requests  
          this.spotify.setTokens(data.access_token, refresh_token); 
          // resend the request with new access_token
          const authReqRepeat = request.clone({
            headers: new HttpHeaders({
              'Authorization': 'Bearer ' + data.access_token
            })
          });
          return next.handle(authReqRepeat);
        }));        
      } else {
        //not a refresh token error, fall through
        return next.handle(request);
      }
    }));
  }
}