import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router'
import { Component, OnInit } from '@angular/core'
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/model/user'
// import { observable, timestamp } from 'rxjs';
import { Board } from 'src/app/model/board';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, catchError, combineLatest, forkJoin, of, switchMap, tap, timestamp } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import 'firebase/compat/firestore';
import firebase from 'firebase/compat/app';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserBoard } from 'src/app/model/userBoard';




// const current_timestamp = timestamp


@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss'],
})



export class WorkspaceComponent implements OnInit  {
  
  static position: number = 0;
  boards: Board[]= [];
  user!: User;
  // isLoading = true;
  showSpinner = true;
 

 

  constructor( private spinner:NgxSpinnerService, private fireAuth: AngularFireAuth,private userService: UserService, public authService: AuthService , public router:Router, private route: ActivatedRoute, private firestore: AngularFirestore) { }
  

  
  async ngOnInit(): Promise<void> {

  
    console.log("onint")
    this.fireAuth.authState.subscribe(async (user) => {
      if (user) {
        const userUID: string= user?.uid;
        (this.userService.getUserData(userUID)).subscribe((user: User) => {
          
          this.user = user;
          console.log(this.user.username);
          console.log("user 2:");
          console.log("Boards after adding new board 2:", this.boards);

        // Fetch boards once and store them in the class property
        this.fetchBoards();
      });   
      } else {
        console.log("no user");
      }
    });
  }



  async startBoard() {
    this.showSpinner = true;
    var board: Board = {
      id: "",
      creator_uid: this.user.uid,
      title: "untitled board",
    }

    const boardID = await this.userService.startBoard(this.user,board);
    this.fetchBoards();
    this.showSpinner = false;
  }
  

  navigateToBoard(boardId: string): void {
    // Navigate to the board/:id route
    this.router.navigate(['/board', boardId]);
  }

  async fetchBoards() {
    try {
      this.userService.getUserBoards(this.user).pipe(
        tap(userBoards => console.log("User Boards:", userBoards)), // Debugging line
        switchMap(userBoards => {
          console.log("h4");
          if (userBoards.length === 0) {
            console.log("User has no boards."); // Debugging line
            return of([]); // Emit an empty array if userBoards is empty
          }
          const boardObservables = userBoards.map(boardID => this.userService.getBoardInfo(boardID.boardId));
          return combineLatest(boardObservables).pipe(
            catchError(error => {
              console.error('Error fetching board info:', error);
              return of([]); // Emit an empty array if an error occurs
            })
          );
        })
      ).subscribe((boards: Board[]) => {
        this.boards = boards;
        console.log("Boards after fetch:", this.boards);
        this.showSpinner = false;
      });
    } catch (error) {
      console.error('Error fetching user boards:', error);
      this.showSpinner = false;
    }
  }
    
 
  onsignOut() {
    this.authService.SignOut()
  }
}
  
  