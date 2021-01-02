import { Component, OnInit } from '@angular/core';

import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-go',
  templateUrl: './go.component.html',
  styleUrls: [ './go.component.css' ]
})
export class GoComponent implements OnInit {

  constructor() { }


  playlists = new MatTableDataSource<any>();


  ngOnInit(): void {
    this.data = this.getData();
    this.playlists.data = this.data;
  }

  data = [];
  displayColumns: string[] = ['movie', 'year', 'director', 'role', 'notes'];

  private getData(): any {
    return [
      { year: 1991, movie: 'Critters 3', role: 'Josh', director: 'Kristine Peterson', notes: 'Direct-to-video', },
      { year: 1992, movie: 'Poison Ivy', role: 'Guy', director: 'Katt Shea', notes: 'Credited as Leonardo Di Caprio', },
      { year: 1993, movie: 'This Boy\'s Life', role: 'Tobias Toby Wolff', director: 'Michael Caton-Jones', },
      { year: 1993, movie: 'What\'s Eating Gilbert Grape', role: 'Arnie Grape', director: 'Lasse Hallström', },
      { year: 1995, movie: 'The Basketball Diaries', role: 'Jim Carroll', director: 'Scott Kalvert', },
      { year: 1995, movie: 'The Quick and the Dead', role: 'Fee The Kid Herod', director: 'Sam Raimi', },
      { year: 1995, movie: 'Total Eclipse', role: 'Arthur Rimbaud', director: 'Agnieszka Holland', },
      { year: 2010, movie: 'Shutter Island', role: 'Edward Teddy Daniels', director: 'Martin Scorsese', },
      { year: 2010, movie: 'Hubble', role: 'Narrator', director: 'NA', notes: 'Documentary', },
      { year: 2010, movie: 'Inception', role: 'Dom Cobb', director: 'Christopher Nolan', },
      { year: 2011, movie: 'J. Edgar', role: 'J. Edgar Hoover', director: 'Clint Eastwood', },
      { year: 2012, movie: 'Django Unchained', role: 'Calvin J. Candie', director: 'Quentin Tarantino', },
      { year: 2013, movie: 'The Great Gatsby', role: 'Jay Gatsby', director: 'Baz Luhrmann', },
      { year: 2013, movie: 'The Wolf of Wall Street', role: 'Jordan Belfort', director: 'Martin Scorsese', },
      { year: 2015, movie: 'The Audition', role: 'Himself', director: 'NA', notes: 'Short film', },
      { year: 2015, movie: 'The Revenant', role: 'Hugh Glass', director: 'Alejandro G. I񡲲itu', },
      { year: 2016, movie: 'Before the Flood', role: 'Himself', director: 'NA', notes: 'Documentary', },
      { year: 2019, movie: 'Ice on Fire', role: 'Narrator', director: 'NA', notes: 'Documentary', },
      { year: 2019, movie: 'Once Upon a Time in Hollywood', role: 'Rick Dalton', director: 'Quentin Tarantino', },

    ];
  }



  users = [
    {
      title: "My Music",
      profileUrl: "assets/defaultprofile.png",
      name: "Jason Amri",
      url: "https://open.spotify.com/user/jasonamri?si=jT_4CWE7TK-4pes7DTjBOQ",
      playlistCount: "12",
      followerCount: "21"
    }
  ]

  
  

}
