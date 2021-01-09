import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DoneComponent } from './done/done.component';
import { GoComponent } from './go/go.component';
import { LandingComponent } from './landing/landing.component';

const routes: Routes = [
  { path: '', redirectTo: 'go', pathMatch: 'full' },
  { path: 'landing', component: LandingComponent },
  { path: 'go', component: GoComponent },
  { path: 'done', component: DoneComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
