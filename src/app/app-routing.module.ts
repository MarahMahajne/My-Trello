import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AboutComponent} from './components/about/about.component';
import {WorkspaceComponent} from './components/workspace/workspace.component';
import {BoardComponent} from './components/board/board.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';



const routes: Routes = [
  { 
    path: '', 
    component: LoginComponent 
  },

  { 
    path: 'login', 
    component: LoginComponent 
  },
  { 
    path: 'register', 
    component: RegisterComponent 
  },
  {
    path: 'workspace/:uid',
    component: WorkspaceComponent,
  },
  {
    path: 'board/:uid',
    component: BoardComponent,
  },
  { 
    path: 'forgot-password', 
  
    component: ForgotPasswordComponent,
  },
  { 
    path: 'verify-email', 
    component: VerifyEmailComponent,
  },
  { 
    path: 'about', 
    component: AboutComponent,
  },
  {
    path: '**',
    redirectTo: '/',
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
