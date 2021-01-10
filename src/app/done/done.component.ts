import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpotifyService } from '../spotify.service';

@Component({
  selector: 'app-done',
  templateUrl: './done.component.html',
  styleUrls: ['./done.component.css']
})
export class DoneComponent implements OnInit {

  constructor(
    private spotify: SpotifyService,
    private activatedRoute: ActivatedRoute
  ) { }

  /*pl = {
    imgUrl: "https://i.scdn.co/image/ab67706c0000bebbb037a467639c1e729a4c3377",
    name: "Togethear Mix",
    description: "Unify your music!",
    shareUrl: "https://open.spotify.com/playlist/6eIxPd89a8Jq70vPsT4yhT"
  }*/

  pl = {
    imgUrl: "",
    name: "",
    description: "",
    shareUrl: ""
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      let playlist_id = params.playlist_id;
      this.spotify.getPlaylist(playlist_id).subscribe(result => {
        this.pl.imgUrl = result.images[0].url;
        this.pl.description = result.description;
        this.pl.shareUrl = result.external_urls.spotify;
        this.pl.name = result.name;
      })
    });
  }

  open(url: string) {
    window.open(url);
  }

}
