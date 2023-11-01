import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss']
})
export class LoadingSpinnerComponent implements OnInit{
   
  
   constructor(private spinner:NgxSpinnerService) {}


   ngOnInit() {
    this.spinner.show()
   }

   
  openSpinner() {
    
    setTimeout(()=>{
        this.spinner.hide();
    },2000)
}
 

}


