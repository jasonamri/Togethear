import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  constructor(
    private http: HttpClient
  ) { }


  access_token = "";
  refresh_token = "";

  setTokens(aT: string, rT: string) {
    this.access_token = aT;
    this.refresh_token = rT;
  }

  getRefreshToken(): string {
    return this.refresh_token;
  }

  private getRequest(url: string) {
    //redirect if no access token is available
    if (this.access_token == "" || this.access_token == undefined) {
      window.location.href = "/login";
      throw new Error("No tokens yet");
    }

    const headers = { 'Authorization': 'Bearer ' + this.access_token }
    return this.http.get<any>(url, { headers })
  }

  getUser(user_id?: string) {
    if (user_id) {
    return this.getRequest('https://api.spotify.com/v1/users/'+user_id)
      
    } else {
      return this.getRequest('https://api.spotify.com/v1/me')

    }
  }

  getPlaylists(user_id: string) {
    return this.getRequest('https://api.spotify.com/v1/users/'+user_id+'/playlists?limit=50')
  }

}
