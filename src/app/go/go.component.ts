import { Component, OnInit, Inject } from '@angular/core';
import { SpotifyService } from '.././spotify.service';
import { FormControl } from '@angular/forms'
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

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
  isClient: boolean,
  title: string,
  profileUrl: string,
  name: string,
  url: string,
  playlistCount: number,
  followerCount: number,
  inclPrivate: boolean,
  shownPlaylists: Array<Playlist>,
  allPlaylists: Array<Playlist>
};


@Component({
  selector: 'app-go',
  templateUrl: './go.component.html'
})
export class GoComponent implements OnInit {

  constructor(
    private spotify: SpotifyService,
    private dialog: MatDialog,
    private router: Router,
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
    username: "",
    id: ""
  }

  searchControl = new FormControl('');

  searchVal: string = "";

  ngOnInit(): void {
    //this.router.navigate(['done'], { queryParams: {playlist_id: "6eIxPd89a8Jq70vPsT4yhT"} });

    this.spotify.getUser().subscribe(data => {
      this.client.ready = true;
      this.client.username = data.display_name;
      this.client.id = data.id;
    })
    this.getUser();
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
          isClient: (uData.id == this.client.id),
          title: user_id ? "Their Music" : "My Music",
          profileUrl: image,
          name: uData.display_name,
          url: uData.external_urls.spotify,
          playlistCount: pData.total,
          followerCount: uData.followers.total,
          inclPrivate: false,
          shownPlaylists: pls.filter(pl => pl.public),
          allPlaylists: pls
        })
      })
    })
  }

  logout() {
    this.spotify.clearTokens();
    this.router.navigate(['landing']);
  }

  togglePrivate(u: User) {
    u.inclPrivate = !u.inclPrivate;
    if (u.inclPrivate) {
      u.shownPlaylists = u.allPlaylists;
    } else {
      u.shownPlaylists = u.allPlaylists.filter(pl => pl.public);
    }
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
    for (const pl of this.users[0].shownPlaylists) {
      if (pl.check) {
        dialogRef.componentInstance.data = { status: "Getting " + this.users[0].name + "'s playlist: " + pl.name };
        let buffer: string[] = await this.getPlaylistTracks(pl.id);
        u1tracks = u1tracks.concat(buffer)
      }
    }
    u1tracks = u1tracks.filter((item, pos) => { return u1tracks.indexOf(item)== pos; }); //remove duplicates


    dialogRef.componentInstance.data = { status: "Done getting " + this.users[0].name + "'s playlists!" };

    let u2tracks: string[] = []
    for (const pl of this.users[1].shownPlaylists) {
      if (pl.check) {
        dialogRef.componentInstance.data = { status: "Getting " + this.users[1].name + "'s playlist: " + pl.name };
        let buffer: string[] = await this.getPlaylistTracks(pl.id);
        u2tracks = u2tracks.concat(buffer)
      }
    }
    u2tracks = u2tracks.filter((item, pos) => { return u2tracks.indexOf(item)== pos; }); //remove duplicates


    dialogRef.componentInstance.data = { status: "Done getting " + this.users[1].name + "'s playlists!" };

    dialogRef.componentInstance.data = { status: "Finding shared songs..." };

    let intersect = u1tracks.filter(value => u2tracks.includes(value)); //find intersect

    dialogRef.componentInstance.data = { status: "Sorting tracks..." };

    intersect.sort();

    dialogRef.componentInstance.data = { status: "Creating new playlist..." };

    let playlist_id = (await this.spotify.createPlaylist(this.users[0].id).toPromise()).id;

    dialogRef.componentInstance.data = { status: "Populating new playlist..." };

    for (let i = 0; i < (intersect.length) / 100; ++i) {
      let start = 0 + (i * 100);
      let end = 100 + (i * 100);
      await this.spotify.addToPlaylist(playlist_id, intersect.slice(start, end)).toPromise();
    }

    dialogRef.componentInstance.data = { status: "Putting a bow on it..." };

    await (await this.spotify.uploadPlaylistImage(playlist_id)).toPromise();

    dialogRef.componentInstance.data = { status: "Done!" };
    dialogRef.close();

    this.router.navigate(['done'], { queryParams: { playlist_id: playlist_id } });
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
  template: `<h3 mat-dialog-title>Error</h3><div mat-dialog-content>User not found!</div>`
})
class DialogNotFound { }

@Component({
  selector: 'dialog-loading',
  template: `<h3 mat-dialog-title>Unifying</h3><div mat-dialog-content>{{data.status}}</div>`
})
class DialogLoading {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
}