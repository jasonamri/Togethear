import { Component, OnInit, Inject } from '@angular/core';
import { SpotifyService } from '.././spotify.service';
import { FormControl } from '@angular/forms'
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { skip } from 'rxjs/operators';
import {Location} from '@angular/common';

interface Playlist {
  check: boolean,
  public: boolean,
  id: string,
  name: string,
  creator: string,
  songs: number
};

interface User {
  id: string,
  title: string,
  profileUrl: string,
  name: string,
  url: string,
  playlistCount: number,
  followerCount: number,
  playlists: Array<Playlist>
};


@Component({
  selector: 'app-go',
  templateUrl: './go.component.html',
  styleUrls: ['./go.component.css']
})
export class GoComponent implements OnInit {

  constructor(
    private spotify: SpotifyService,
    private dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public location: Location
  ) { }

  users: User[] = []

  displayedColumns: string[] = ['check', 'name', 'creator', 'songs'];

  emptyUser = {
    title: "Their Music",
    profileUrl: "assets/defaultprofile.png",
  }

  client = {
    ready: false,
    username: ""
  }

  searchControl = new FormControl('');

  searchVal: string = "";

  ngOnInit(): void {
    //this.router.navigate(['done'], { queryParams: {'playlist_id': "6eIxPd89a8Jq70vPsT4yhT"} });

    //let currentUrl = this.location.path();
    //console.log(currentUrl);
    this.activatedRoute.queryParams.subscribe(params => {
      let access_token = params['access_token'];
      let refresh_token = params['refresh_token'];
      let error = params['error'];

      //console.log(access_token);

      if (error) { //TODO better error handling
        console.log('There was an error during the authentication');
        console.log(error);
      }

      this.spotify.setTokens(access_token, refresh_token);
      this.spotify.getUser().subscribe(data => {
        this.client.ready = true;
        this.client.username = data["display_name"];
      })
      this.getUser();
    });
  }


  private getUser(user_id?: string) {
    this.spotify.getUser(user_id).subscribe(uData => {
      this.spotify.getPlaylists(uData["id"]).subscribe(pData => {
        //gather playlists
        let pls: Playlist[] = []
        pData.items.forEach((i: any) => {
          pls.push({
            check: true,
            public: i.public,
            id: i.id,
            name: i.name,
            creator: i.owner.display_name,
            songs: i.tracks.total
          })
        })

        //add profile
        let image = (uData.images.length == 0) ? "assets/defaultprofile.png" : uData.images[0].url;
        this.users.push({
          id: uData.id,
          title: user_id ? "Their Music" : "My Music",
          profileUrl: image,
          name: uData.display_name,
          url: uData.external_urls.spotify,
          playlistCount: pData.total,
          followerCount: uData.followers.total,
          playlists: pls
        })
      })
    })
  }

  logout() {
    this.spotify.clearTokens();
    this.router.navigate(['landing']);
  }


  search() {
    this.spotify.getUser(this.searchControl.value).subscribe(data => {
      this.getUser(data.id)
    }, (err) => {
      if (err.status === 404 && err.error.error.message == "No such user") {
        console.log("User not found")
        this.dialog.open(DialogNotFound);
        this.searchControl.setErrors({ 'notfound': true });
      }
    })
  }

  async unify() {
    let dialogRef = this.dialog.open(DialogLoading, { width: '480px', disableClose: true });
    dialogRef.componentInstance.data = { status: "Starting..." };

    let u1tracks: string[] = []
    for (const pl of this.users[0].playlists) {
      if (pl.check) {
        dialogRef.componentInstance.data = { status: "Getting " + this.users[0].name + "'s playlist: " + pl.name };
        let buffer: string[] = await this.getPlaylistTracks(pl.id);
        u1tracks = u1tracks.concat(buffer)
      }
    }

    dialogRef.componentInstance.data = { status: "Done getting " + this.users[0].name + "'s playlists!" };

    let u2tracks: string[] = []
    for (const pl of this.users[1].playlists) {
      if (pl.check) {
        dialogRef.componentInstance.data = { status: "Getting " + this.users[1].name + "'s playlist: " + pl.name };
        let buffer: string[] = await this.getPlaylistTracks(pl.id);
        u2tracks = u2tracks.concat(buffer)
      }
    }

    dialogRef.componentInstance.data = { status: "Done getting " + this.users[1].name + "'s playlists!" };

    dialogRef.componentInstance.data = { status: "Finding shared songs..." };

    let intersect = u1tracks.filter(value => u2tracks.includes(value));

    dialogRef.componentInstance.data = { status: "Sorting tracks..." };

    intersect.sort();

    dialogRef.componentInstance.data = { status: "Creating new playlist..." };

    let playlist_id = (await this.spotify.createPlaylist(this.users[0].id).toPromise()).id;

    dialogRef.componentInstance.data = { status: "Populating new playlist..." };

    for (let i = 0; i < (intersect.length) / 100; ++i) {
      let start = 0 + (i * 100);
      let end = 100 + (i * 100);
      await this.spotify.addToPlaylist(playlist_id, intersect.slice(start, end)).toPromise();
      console.log(intersect.slice(start, end));
    }

    dialogRef.componentInstance.data = { status: "Putting a bow on it..." };

    await (await this.spotify.uploadPlaylistImage(playlist_id)).toPromise();

    dialogRef.componentInstance.data = { status: "Done!" };
    dialogRef.close();

    this.router.navigate(['done', { queryParams: {'playlist_id': playlist_id} }]);
  }

  private async getPlaylistTracks(playlist_id: string) {
    let result: string[] = []
    let offset = 0;
    let tracks = await this.spotify.getTracks(playlist_id, offset).toPromise();
    tracks.items.forEach((t: any) => {
      result.push(t.track.uri)
    })
    while (tracks.next != null) {
      offset += 100;
      tracks = await this.spotify.getTracks(playlist_id, offset).toPromise();
      tracks.items.forEach((t: any) => {
        result.push(t.track.uri)
      })
    }
    return result;
  }
}


@Component({
  selector: 'dialog-notfound',
  template: `<h1 mat-dialog-title>Error</h1><div mat-dialog-content>User not found!</div>`
})
class DialogNotFound { }

@Component({
  selector: 'dialog-loading',
  template: `<h1 mat-dialog-title>Unifying</h1><div mat-dialog-content>{{data.status}}</div>`
})
class DialogLoading {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
}