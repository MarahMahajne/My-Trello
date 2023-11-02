import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  public bgImage:any;
  ngOnInit(): void {
    this.bgImage = 'url(assets/images/trelloIMG.png)';
  }
}
