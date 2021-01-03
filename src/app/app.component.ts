import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpotifyService } from './spotify.service';
import { skip } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private spotify: SpotifyService
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.pipe(skip(1)).subscribe(params => {
      let access_token = params['access_token'];
      let refresh_token = params['refresh_token'];
      let error = params['error'];

      if (error) { //TODO better error handling
        console.log('There was an error during the authentication');
        console.log(error);
      }

      this.spotify.setTokens(access_token, refresh_token);
      this.spotify.getUser().subscribe(data => {
        this.client.ready = true;
        this.client.username = data["display_name"];
      })
    });

  }

  client = {
    ready: false,
    username: ""
  }

  logout() {
    this.client.ready = false;
  }


}

