import { Component, OnInit } from '@angular/core';
import { environment } from './../../environments/environment';

@Component({
  selector: 'app-login',
  template: `
    <p>
      {{status}}
    </p>
  `,
  styles: [
  ]
})
export class LoginComponent implements OnInit {

  constructor() { }

  status = "Redirecting to login...";

  private stringify(params: any) {
    return Object.keys(params).map(key => key + '=' + params[key]).join('&');
  }

  //Generates a random string containing numbers and letters
  private generateRandomString(length: number) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  ngOnInit(): void {
    const state = this.generateRandomString(16);
    document.cookie = "spotify_auth_state" + "=" + state;

    const scope = 'user-read-private ugc-image-upload playlist-modify-public playlist-read-private';

    const params = {
      response_type: 'code',
      client_id: environment.client_id,
      scope: scope,
      redirect_uri: location.protocol + '//' + location.host + "/togethear/callback",
      state: state
    }

    window.location.href = 'https://accounts.spotify.com/authorize?' + this.stringify(params);
  }

}
