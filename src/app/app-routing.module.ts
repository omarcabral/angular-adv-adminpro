import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NopagefoundComponent } from './nopagefound/nopagefound.component';
import { PagesRoutingModule } from './pages/pages.routing';
import { AuthRoutingModule } from './auth/auth-routing';

const routes: Routes = [

  //path: '/auth  authRouting'
  //path; '/pages pagesRouting'
  {path: '', redirectTo:'/dashboard', pathMatch:'full'},
  { path: '**', component: NopagefoundComponent },
];

@NgModule({
  imports: [CommonModule,
    PagesRoutingModule,
    AuthRoutingModule,
    RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
