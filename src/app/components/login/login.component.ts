import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router'; 
import { AppSettings, Settings } from 'src/app/app.settings';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { Observable } from 'rxjs';





@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm!: UntypedFormGroup;
  public hide = true;
  public bgImage:any;
  public settings: Settings;
  private users: Observable<any[]>[] = [];


  constructor(public authService: AuthService, public userService: UserService ,public fb: UntypedFormBuilder, public router:Router, private sanitizer:DomSanitizer, public appSettings:AppSettings) { 
    this.settings = appSettings.settings; 
  }

  ngOnInit(): void {
    this.bgImage = 'url(assets/images/trelloIMG.png)';
    this.loginForm = this.fb.group({
      email: [null, Validators.compose([Validators.required, Validators.minLength(6)])],
      password: [null, Validators.compose([Validators.required, Validators.minLength(6)])],
      rememberMe: false
    });
  }

  public onLoginFormSubmit():void {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value)
      // this.router.navigate(['/workspace']);
    }
  }



  public onLogIn() {
    console.log("hiiiiiiiiii")
    if (this.loginForm.valid) {
      const {email, password} = this.loginForm.value
      alert(email)
      alert(password)
      this.authService.SignIn(email, password);
  }
 }


 public onResetPassword() {
    this.router.navigate(['/forgot-password']);
 }


 public onGoogleSignin() {
     this.authService.googleSignIn();
        
 }

 public onGitHubSignin() {
  this.authService.gitHubSignIn();
     
}
public onFacebookSignin() {
  this.authService.facebookSignIn();
     
}

}
