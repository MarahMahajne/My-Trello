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
        console.log("mmmmmmmmmmm");
        console.log(userUID);
        (this.userService.getUserData(userUID)).subscribe((user: User) => {
          
          this.user = user;
          console.log("what");
          console.log(this.user.username);
          console.log("user 2:");
          console.log("Boards after adding new board 2:", this.boards);

        // Fetch boards once and store them in the class property
        this.fetchBoards();
      });
        console.log("ok");

        
      } else {
        console.log("no");
      }
    });
  }



  async startBoard() {
   
    console.log("clicked!");
    // const timestamp = firebase.firestore.FieldValue.serverTimestamp();

    var board: Board = {
      id: "",
      creator_uid: this.user.uid,
      title: "untitled board",
      // created_at: timestamp as firebase.firestore.Timestamp,

    }

    const boardID = await this.userService.startBoard(this.user,board);
    this.showSpinner = false;
    console.log(boardID);
    this.fetchBoards();
    console.log("SECOUND");
    console.log(this.boards);
  }
  

  navigateToBoard(boardId: string): void {
    // Navigate to the board/:id route
    console.log("board")
    console.log(boardId)

    this.router.navigate(['/board', boardId]);
  }

  async fetchBoards() {
    try {
      console.log("ppppppppppppppp");
      
      this.userService.getUserBoards(this.user).pipe(
        tap(userBoards => console.log("User Boards:", userBoards)), // Debugging line
        switchMap(userBoards => {
          console.log("h4");
          if (userBoards.length === 0) {
            console.log("User has no boards."); // Debugging line
            return of([]); // Emit an empty array if userBoards is empty
          }
          const boardObservables = userBoards.map(boardID => this.userService.getBoardInfo(boardID.boardId));
          console.log("h5");
          return combineLatest(boardObservables).pipe(
            catchError(error => {
              console.log("h7");
              console.error('Error fetching board info:', error);
              return of([]); // Emit an empty array if an error occurs
            })
          );
        })
      ).subscribe((boards: Board[]) => {
        console.log("h6");
        this.boards = boards;
        console.log("ccccccccccccccc");
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
  
  