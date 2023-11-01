import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router'; 
import { MatSnackBar } from '@angular/material/snack-bar';
import { matchingPasswords, emailValidator } from 'src/app/theme/utils/app-validators';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/model/user'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public registerForm!: UntypedFormGroup;
  public hide = true; 
  public bgImage:any;
  public photoURL = "assets/images/photo_of_person.png";
  public emailVerified = true;
  
  constructor(public authService: AuthService ,private userService: UserService, public fb: UntypedFormBuilder, public router:Router, public snackBar: MatSnackBar, private sanitizer:DomSanitizer) { }

  ngOnInit() {
    this.bgImage = this.sanitizer.bypassSecurityTrustStyle('url(assets/images/project-manger.png)');
    this.registerForm = this.fb.group({ 
      username: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      email: ['', Validators.compose([Validators.required, emailValidator])],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      receiveNewsletter: false                            
    },{validator: matchingPasswords('password', 'confirmPassword')});

    


  }

  public onRegisterFormSubmit():void {
    if (this.registerForm.valid) {
      console.log(this.registerForm.value);
      this.snackBar.open('You registered successfully!', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
    }
  }

  public onSignUp(): void {
    if (this.registerForm.valid) {
      const { username,email, password } = this.registerForm.value;
      // Call the SignUp function in AuthService with email and password

      // const userData: User = {
      //   uid: "", 
      //   email: email, 
      //   username: username,
      //   photoURL: this.photoURL,
      //   emailVerified: this.emailVerified
      // };
      this.authService.SignUp(email, password, username);
    
    }
  }
}
