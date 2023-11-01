import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';

import { AppSettings } from './app.settings';


import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import {  } from '@angular/material/radio';
import { MatRadioModule } from '@angular/material/radio'; 
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgIf } from '@angular/common';
import { NgFor } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FormsModule } from '@angular/forms'; 
// import { NgScrollbarModule } from '@ngx-scrollbar';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { MatToolbar } from '@angular/material/toolbar';

import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { RegisterComponent} from './components/register/register.component';
import { WorkspaceComponent } from './components/workspace/workspace.component';
import { AboutComponent } from './components/about/about.component';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { environment } from 'src/environments/environment';

import { AuthService } from './services/auth.service';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import {AngularFireDatabase } from '@angular/fire/compat/database';


import { NgxSpinnerModule } from 'ngx-spinner'
import { GravatarModule } from 'ngx-gravatar';
import { BoardComponent } from './components/board/board.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component'



const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: false,
  suppressScrollX: true               
};





@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    RegisterComponent,
    WorkspaceComponent,
    BoardComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    LoadingSpinnerComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    NgIf,
    MatFormFieldModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatRadioModule,
    NgFor,
    FormsModule,
    MatToolbarModule,
    MatSnackBarModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    NgxSpinnerModule,
    GravatarModule


  ],
  providers: [
    AppSettings,
    AngularFireModule,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
