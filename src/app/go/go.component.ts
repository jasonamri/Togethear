import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '.././spotify.service';
import { FormControl } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog';


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
    public dialog: MatDialog
  ) { }

  users: User[] = []

  displayedColumns: string[] = ['check', 'name', 'creator', 'songs'];

  emptyUser = {
    title: "Their Music",
    profileUrl: "assets/defaultprofile.png",
  }

  searchControl = new FormControl('');

  searchVal: string = "";

  ngOnInit(): void {
    this.getUser()
    //this.getUser("taylodday01")
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

  unify() {
    
  }
}


@Component({
  selector: 'dialog-notfound',
  template: `<h1 mat-dialog-title>Error</h1><div mat-dialog-content>User not found!</div>`,
})
class DialogNotFound {}