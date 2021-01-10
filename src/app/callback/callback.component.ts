import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { stringify } from 'querystring';
import { SpotifyService } from '../spotify.service';
import { environment } from './../../environments/environment';


@Component({
  selector: 'app-callback',
  template: `
    <p>
      {{status}}
    </p>
  `,
  styles: [
  ]
})
export class CallbackComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private spotify: SpotifyService
  ) { }

  status = "Logging in...";

  private getCookie(name: string) {
    if (document.cookie) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        return parts.pop()!.split(';').shift();
      }
    }
    return null;
  }

  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe(params => {
      let code = params.code || null;
      let state = params.state || null;
      let storedState = this.getCookie(environment.stateKey);
      console.log(storedState);


      if (state === null || state !== storedState) {
        this.status = "Error: " + "state_mismatch";
      } else {
        //clear cookie
        document.cookie = environment.stateKey + '=; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';

        const headers = {
          'Authorization': 'Basic ' + btoa(environment.client_id + ':' + environment.client_secret),
          'Content-Type': 'application/x-www-form-urlencoded'
        }

        const body = {
          code: code,
          redirect_uri: environment.redirect_uri,
          grant_type: 'authorization_code'
        }

        this.http.post<any>('https://accounts.spotify.com/api/token', stringify(body), { headers, observe: 'response' }).subscribe(response => {
          if (response.status === 200) {
            this.spotify.setTokens(response.body.access_token, response.body.refresh_token);
            this.router.navigate(['go']);
          } else {
            this.status = "Error: " + "invalid_token";
          }
        });
      }

    });

  }

}
