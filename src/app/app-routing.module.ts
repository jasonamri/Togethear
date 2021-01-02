import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GoComponent } from './go/go.component';
import { LandingComponent } from './landing/landing.component';

const routes: Routes = [
  { path: '', component: GoComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
