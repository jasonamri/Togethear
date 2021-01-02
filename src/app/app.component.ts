import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'togethear';

  client = { 
    ready: true,
    username: "jasonamri"
  }

  logout() {
    this.client.ready = false;
  }
}

