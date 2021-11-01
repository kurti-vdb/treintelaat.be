import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "../guards/auth.guard";

import { JoinComponent } from '../components/modals/join/join.component';
import { LoginComponent } from '../components/modals/login/login.component';
import { AccountComponent } from '../components/pages/account/account.component';
import { LandingComponent } from '../components/pages/landing/landing.component';
import { DashboardComponent } from '../components/pages/dashboard/dashboard.component';
import { ProfileComponent } from '../components/pages/profile/profile.component';

const routesNL: Routes = [
  //{ path: '', component: LandingComponent, pathMatch: 'full'},
  { path: 'login', component: LoginComponent},
  { path: 'registreer', component: JoinComponent},
  { path: 'recover', component: LandingComponent },
  { path: 'verify', component: LandingComponent },
  { path: 'pinmachine', component: LandingComponent },
  { path: 'account', component: AccountComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'profiel', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'delays', component: LandingComponent, canActivate: [AuthGuard],
    children: [
      { path: 'overview', component: LandingComponent },
      { path: 'add', component: LandingComponent },
      { path: 'edit', component: LandingComponent },
      { path: 'remove', component: LandingComponent },
    ]
  },
  { path: 'legal', component: LandingComponent },
  { path: 'terms', component: LandingComponent },
  { path: 'privacy', component: LandingComponent },
  { path: 'cookies', component: LandingComponent },
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '**', component: LandingComponent }
];

const routesEN: Routes = [
  { path: '', component: LandingComponent,
    children: [
      { path: 'overview', component: LandingComponent },
      { path: 'login', component: LandingComponent },
      { path: 'join', component: LandingComponent },
      { path: 'pinmachine', component: LandingComponent },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routesNL),
    RouterModule.forRoot(routesEN)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
