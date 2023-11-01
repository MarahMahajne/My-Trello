import { Component } from '@angular/core';
import { Router } from '@angular/router'; 3
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})

export class ForgotPasswordComponent {


  public bgImage:any;
  public email: string='';


  constructor(public authService: AuthService, public router:Router) { 
   
  }

  ngOnInit(): void {
    this.bgImage = 'url(assets/project-manger.png)';
  
  }

 
 public onResetPassword() {
    this.authService.ForgotPassword(this.email);
    console.log(this.email);
    this.router.navigate(['/verify-email']);
 }

}
