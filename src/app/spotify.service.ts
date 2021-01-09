import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ImagesService } from './images.service';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  constructor(
    private http: HttpClient,
    private images: ImagesService
  ) { }


  private access_token = "";
  private refresh_token = "";

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

  private postRequest(url: string, body: any) {
    //redirect if no access token is available
    if (this.access_token == "" || this.access_token == undefined) {
      window.location.href = "/login";
      throw new Error("No tokens yet");
    }

    const headers = { 'Authorization': 'Bearer ' + this.access_token, 'Content-Type': 'application/json' }
    return this.http.post<any>(url, body, { headers })
  }

  private putRequest(url: string, body: any) {
    //redirect if no access token is available
    if (this.access_token == "" || this.access_token == undefined) {
      window.location.href = "/login";
      throw new Error("No tokens yet");
    }

    const headers = { 'Authorization': 'Bearer ' + this.access_token, 'Content-Type': 'image/jpeg' }
    return this.http.put<any>(url, body, { headers })
  }



  getUser(user_id?: string) {
    if (user_id) {
      return this.getRequest('https://api.spotify.com/v1/users/' + user_id);
    } else {
      return this.getRequest('https://api.spotify.com/v1/me');
    }
  }

  getPlaylists(user_id: string) {
    return this.getRequest('https://api.spotify.com/v1/users/' + user_id + '/playlists?limit=50')
  }

  getTracks(playlist_id: string, offset: number) {
    return this.getRequest('https://api.spotify.com/v1/playlists/' + playlist_id + '/tracks?limit=100&offset=' + offset)
  }

  createPlaylist(user_id: string) {
    let body = {
      'name': "Togethear Mix",
      'description': "Unify your music!"
    }
    return this.postRequest("https://api.spotify.com/v1/users/" + user_id + "/playlists", body);
  }

  addToPlaylist(playlist_id: string, tracks: Array<string>) {
    return this.postRequest("https://api.spotify.com/v1/playlists/"+playlist_id+"/tracks", { 'uris' : tracks});
  }

  uploadPlaylistImage(playlist_id: string) {
    return this.images.getCoverArtImage().then(res => {
      return this.putRequest("https://api.spotify.com/v1/playlists/" + playlist_id + "/images", res);
    })
  }

}
