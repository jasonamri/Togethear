import { Component, OnInit } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-go',
  templateUrl: './go.component.html',
  styleUrls: ['./go.component.css']
})
export class GoComponent implements OnInit {

  constructor() { }





  ngOnInit(): void { }

  data = [];
  displayedColumns: string[] = ['check', 'name', 'creator', 'songs', 'runtime'];


  users = [
    {
      title: "My Music",
      profileUrl: "assets/defaultprofile.png",
      name: "Jason Amri",
      url: "https://open.spotify.com/user/jasonamri?si=jT_4CWE7TK-4pes7DTjBOQ",
      playlistCount: "12",
      followerCount: "21",
      playlists: [
        {
          check: true,
          name: "Long List 4.0",
          creator: "jasonamri",
          songs: "234",
          runtime: "hi"
        }
      ]
    }
  ]


  emptyUser = {
    title: "Their Music",
    profileUrl: "assets/defaultprofile.png",
  }


}
