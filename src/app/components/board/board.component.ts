import { UserService } from 'src/app/services/user.service'
import { Component, HostListener, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Board } from 'src/app/model/board'
import { Card } from 'src/app/model/card'
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { List } from 'src/app/model/list'
import { combineLatest, of, switchMap, timestamp } from 'rxjs'
import 'firebase/compat/firestore';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  lists: List[] = []
  boardId: string | null = null
  editTitle: any = {}
  editCard: any = {}
  boardInfo: any = null
  titleChanged = false


  listCards: any = {}
  addUserEmail = ''
  board: Board = {
    id: "",
    creator_uid: "",
    title: "",
    // created_at: firebase.firestore.FieldValue.serverTimestamp()
  }
  user: any;
  showSpinner = true;

  constructor(private fireAuth: AngularFireAuth, private route: ActivatedRoute, private userService: UserService, private router: Router
  ) {}

  async ngOnInit() {
    this.fireAuth.authState.subscribe(async (user) => {
      if (user) 
      {
          this.user = user;
          console.log("ok");
          this.boardId = this.route.snapshot.paramMap.get('uid');
          console.log("board_id_in_board_componenet:");
          console.log(this.boardId);
          
          // Load general board information
          if (this.boardId) 
          {
            //load BOARD INFO:
            console.log("user1:");
            console.log(user.uid);
            const board = this.userService.getBoardInfo(this.boardId);
            this.userService.getBoardInfo(this.boardId).subscribe((board) => {
            this.board = board;
            console.log("Boards after initial fetch:", this.board);
            });
            this.handleRealtimeUpdates(this.boardId);

            console.log("a3");
         }
      }
    }); 
  
    
      // Retrieve all lists
     

      // // Retrieve cards for each list
      // for (let list of this.lists) {
      //   this.listCards[list.id] = await this.userService.getListCards(list.id)
      // }

      // For later...
      // this.handleRealtimeUpdates()
    
  }

  //
  // BOARD logic
  //
  async saveBoardTitle() {
    await this.userService.updateBoard(this.board)
    this.titleChanged = false
  }

  async deleteBoard() {
    await this.userService.deleteBoard(this.board)
    this.router.navigate(['/workspace', this.user.uid])
  }

  //
  // LISTS logic
  //
  async addList() {
    const newListData: List = {
      id: "",
      board_id: this.board.id,
      position: this.lists.length,
      title: "New List",
      user_id: this.user.uid
      // created_at: typeof timestamp;
     }
    const newList = await this.userService.addBoardList(newListData);
    // this.lists.push(newList);
    this.userService.getBoardLists(this.board.id).subscribe((lists) => {
    this.lists = lists;
    });
    

    console.log("clicked1!");
  }

  editingTitle(list: any, edit = false) {
    this.editTitle[list.id] = edit;
  }

  async updateListTitle(list: List) {
    await this.userService.updateBoardList(list)
    this.editingTitle(list, false);
  }

  async deleteBoardList(list: List) {
    await this.userService.deleteBoardList(list);
  }

  
  // CARDS logic

  async addCard(list: List) {
      const newcard: Card = {
      id: "",
      list_id: list.id,
      board_id: this.board.id,
      position: 0,
      title: "",
      done : false,
      user_id: this.user.uid
      // created_at: typeof timestamp;
     }
     console.log("add card!");
     console.log(newcard);

    await this.userService.addListCard(newcard);
    this.userService.getListCards(list).subscribe((cards) => {
      const newCards = cards;
      this.listCards[list.id] = newCards;
      console.log(this.listCards[list.id].title);
      console.log(this.listCards[list.id].position);
    });
    
  }
  // async addCard(list: any) {
  //   await this.dataService.addListCard(list.id, this.boardId!, this.listCards[list.id].length)
  // }

  editingCard(card: any, edit = false) {
    this.editCard[card.id] = edit
  }

  async updateCard(card: Card) {
    await this.userService.updateCard(card)
    this.editingCard(card, false)
  }

  async deleteCard(card: Card) {
    await this.userService.deleteCard(card)
  }

  
  async addUser() {
      try {
        const boardId = await this.userService.addUserToBoard(this.board, this.addUserEmail);
        // const sharedBoardSnapshot = await sharedBoardRef.get();
        
        // if (sharedBoardSnapshot.exists) {
        //     const sharedBoardData = sharedBoardSnapshot.data();
        //     const user2Id = sharedBoardData.creator_uid;
        //     const boardId = sharedBoardSnapshot.id;

        //     console.log("user2:", user2Id);
        //     this.handleRealtimeUpdates(user2Id, boardId);
        // } else {
        //     console.log("Shared board not found.");
        // }
        this.handleRealtimeUpdates(boardId);

        this.addUserEmail = '';
    } catch (error) {
        console.error("Error adding user to board:", error);
    }
  }

  handleRealtimeUpdates(boardID: string) {
    // TODO
    if (this.boardId) 
    {
      // load BOARD LISTS:
      console.log("a1")
      this.userService.getBoardLists(boardID).pipe(
        switchMap((lists: List[]) => {
          const listObservables = lists.map(list => this.userService.getListCards(list));
          return combineLatest([of(lists), ...listObservables])

        })
      ).subscribe(([lists, ...listCards]) => {
        this.showSpinner  = false;
        this.lists = lists;
        listCards.forEach((cards, index) => {
          const listId = this.lists[index].id;
          this.listCards[listId] = cards;
        });
      });  
      console.log("a2");
    }

    
  }

}
