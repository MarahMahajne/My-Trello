import { Component } from '@angular/core';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent {


  public bgImage:any;

  ngOnInit(): void {
    this.bgImage = 'url(assets/project-manger.png)';
  
  }

}
