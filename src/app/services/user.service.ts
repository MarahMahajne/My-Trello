import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, CollectionReference, DocumentData } from '@angular/fire/compat/firestore';
import { Observable, map, take } from 'rxjs';
import {User} from '../model/user'
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Board } from '../model/board';
import { Card } from '../model/card';
import { List } from '../model/list';
import 'firebase/compat/firestore';
import firebase from 'firebase/compat/app';
import { BoardUser} from '../model/boardUser';
import { UserBoard } from '../model/userBoard';



@Injectable({
  providedIn: 'root',
})
export class UserService  {
 
  public db: AngularFirestore;
  private users!: Observable<any[]>;
  subcollection: any;
  

  constructor(private firestoreDB: AngularFirestore, private fireAuth: AngularFireAuth) {
    this.db = firestoreDB;
    
  }

  authState$: Observable<firebase.User | null> = this.fireAuth.authState;

//   getuserslist(): Observable<any[]>  {
//     // Assign the observable without subscribing here
//     this.users.subscribe((data) => {
//         this.users = data;
//     });
//   }


//   updateUserData(uid: string, data: Partial<User>): Promise<void> {
//     const userRef: AngularFirestoreDocument<User> = this.db.doc(
//         `User/${uid}`
//     );

//     // Update the user document with the provided data
//     return userRef.update(data);
//    }

//     // Add a method to get user data from Firestore
//     getUserData(uid: string): Observable<User | undefined> {

//         const userRef: AngularFirestoreDocument<User> = this.db.doc(
//             `User/${uid}`
//         );
//         console.log("HI");
//         console.log(userRef.valueChanges())
//         return userRef.valueChanges(); 
//     }



    // add user
    addUser(user: User): Promise<void> {
        const userRef: AngularFirestoreDocument<any> = this.firestoreDB.doc(
          `users/${user.uid}`
        );
        return userRef.set(user, { merge: true });
    }

    // get user
    // getUser( user: User) {
    //     return this.firestoreDB.doc('/user/' + user.uid).snapshotChanges();
    // }

    getUserData(uid: string): Observable<any> {
        return this.firestoreDB.collection('users').doc(`${uid}`).valueChanges();
    }
    // get users
    geAllUsers() {
        return this.firestoreDB.collection('users').snapshotChanges();
    }

    // delete user
    deleteUser(user: User) {
      return this.firestoreDB.collection('users').doc(`${user.uid}`).delete();
    }

    // update user
    updateUser(user: User) {
        this.deleteUser(user);
        this.addUser(user);
    }

    // CRUD Board
    getBoardInfo(boardId: string): Observable<any> {
        console.log("dswgfjr");
        console.log(boardId);
        const boardcollection: AngularFirestoreCollection<Board> = this.firestoreDB.collection(`boards`);
        return boardcollection.doc(`${boardId}`).valueChanges();
    }

    updateBoard(boardInfo: Board): Promise<void> {
        const boardcollection: AngularFirestoreCollection<Board> = this.firestoreDB.collection(`boards`);
        return boardcollection.doc(`${boardInfo.id}`).update(boardInfo);
    }

    deleteBoard(boardInfo: Board): Promise<void> {
        const boardcollection: AngularFirestoreCollection<Board> = this.firestoreDB.collection(`boards`);
        return boardcollection.doc(`${boardInfo.id}`).delete();
    }

    // CRUD Lists
    getBoardLists(boardId: string): Observable<any[]> {
        const boardcollection: AngularFirestoreCollection<Board> = this.firestoreDB.collection(`boards`);
        const boardDoc = boardcollection.doc(`${boardId}`)
        return boardDoc
        .collection(`lists`, ref => ref.orderBy('position'))
        .valueChanges();
    }

    async addBoardList(list: List):  Promise<any> {
        const boardcollection: AngularFirestoreCollection<Board> = this.firestoreDB.collection(`boards`);
        const boardDoc = boardcollection.doc(`${list.board_id}`)
        const listcollectiion = boardDoc.collection(`lists`);
        console.log("clicked2!");
        const listRef = listcollectiion.add(list);
        const listID = (await listRef).id;
        await (await listRef).update({ id: listID });
        console.log(listID)
        return listRef
       
    }

    updateBoardList(list: List): Promise<void> {
        const boardcollection: AngularFirestoreCollection<Board> = this.firestoreDB.collection(`boards`);
        const boardDoc = boardcollection.doc(`${list.board_id}`)
        const listcollectiion = boardDoc.collection(`lists`);
        return listcollectiion.doc(`${list.id}`).update(list);
    }

  
    deleteBoardList(list: List): Promise<void> {
        const boardcollection: AngularFirestoreCollection<Board> = this.firestoreDB.collection(`boards`);
        const boardDoc = boardcollection.doc(`${list.board_id}`);
        const listcollectiion = boardDoc.collection(`lists`);
        return listcollectiion.doc(`${list.id}`).delete();
        
    }

    // CRUD Cards
    getListCards(list: List): Observable<any[]> {
      try 
       {
          const boardcollection: AngularFirestoreCollection<Board> = this.firestoreDB.collection(`boards`);
          console.log("b4");
          const boardDoc = boardcollection.doc(`${list.board_id}`);
          console.log("b5");
          const listcollection = boardDoc.collection(`lists`);
          console.log("b6");
          const listDoc = listcollection.doc(`${list.id}`);
          console.log("b7");
          return listDoc
          .collection(`cards`, ref => ref.orderBy('position'))
          .valueChanges();
        } 
        catch (error) 
        {
          console.error('Error fetching cards:', error);
          throw error; // Reject the promise if an error occurs
        }
    }
    // async getListCards(listId: string) {
    //     const lists = await this.supabase
    //       .from(CARDS_TABLE)
    //       .select('*')
    //       .eq('list_id', listId)
    //       .order('position');
    
    //     return lists.data || [];
    //   }
    
   
    

    async addListCard(card: Card): Promise<any> {
        const boardcollection: AngularFirestoreCollection<Board> = this.firestoreDB.collection(`boards`);
        const boardDoc = boardcollection.doc(`${card.board_id}`);
        const listcollection = boardDoc.collection(`lists`);
        const listDoc = listcollection.doc(`${card.list_id}`);
        const cardCollection = listDoc.collection(`cards`);
        const cardRef = cardCollection.add(card);
        const cardID = (await cardRef).id;
        await (await cardRef).update({ id: cardID });
        console.log(cardID)
        return cardRef
    }

    updateCard(card: Card): Promise<void> {
        const boardcollection: AngularFirestoreCollection<Board> = this.firestoreDB.collection(`boards`);
        const boardDoc = boardcollection.doc(`${card.board_id}`);
        const listcollection = boardDoc.collection(`lists`);
        const listDoc = listcollection.doc(`${card.list_id}`);
        const cardCollection = listDoc.collection(`cards`)
        return cardCollection.doc(`${card.id}`).update(card);
    }

    deleteCard(card: Card): Promise<void> {
        const boardcollection: AngularFirestoreCollection<Board> = this.firestoreDB.collection(`boards`);
        const boardDoc = boardcollection.doc(`${card.board_id}`);
        const listcollection = boardDoc.collection(`lists`);
        const listDoc = listcollection.doc(`${card.list_id}`);
        const cardCollection = listDoc.collection(`cards`)
        return cardCollection.doc(`${card.id}`).delete();
    }

    async startBoard(user:User, board: Board): Promise<any> {
        const boardData: Board = {
            id:board.id,
            creator_uid: board.creator_uid,
            title: board.title,
            // created_at: board.created_at
        }
        const boardcollection: AngularFirestoreCollection<Board> = this.firestoreDB.collection(`boards`);
        console.log('Board ID:',  boardData.id); 
        console.log('User ID:', boardData.creator_uid); 
        const boardRef = boardcollection.add(board);
        const boardID = (await boardRef).id;
        boardData.id = boardID;
        await (await boardRef).update({ id: boardID });
        console.log("u1");
        console.log(boardData.id);
        console.log(boardID);

        //add user to board
        const boardDoc = boardcollection.doc(`${boardID}`);
        const boardUsersCollection = boardDoc.collection(`boardUsers`);
        const boarduser : BoardUser = {
              uid: user.uid
        } 
        const boardUser = boardUsersCollection.doc(user.uid).set(boarduser);

         //add board to user
         const userscollection: AngularFirestoreCollection<User> = this.firestoreDB.collection(`users`);
         const userDoc = userscollection.doc(`${user.uid}`);
         const userBoardsCollection = userDoc.collection(`userBoards`);
         const userboard : UserBoard = {
           boardId: boardID
        } 
         const userBoard = userBoardsCollection.doc(boardID).set(userboard);
        return boardData;
  } 
    
    
    getUserBoards(user:User): Observable<UserBoard[]> {
        console.log("h1");
        const userscollection: AngularFirestoreCollection<User> = this.firestoreDB.collection(`users`);
        const userDoc = userscollection.doc(`${user.uid}`);
        console.log("h2");
        const userBoardsCollection: AngularFirestoreCollection<UserBoard>  = userDoc.collection(`userBoards`);
        console.log("h3");
        return userBoardsCollection
        .valueChanges();
       
    }


    async addUserToBoard(board: Board, email: string): Promise<any> {

        try {

          // Find the user2 with the specified email
          const querySnapshot = await this.firestoreDB.collection('users', ref => ref.where('email', '==', email)).get().toPromise();
          console.log("my name");
      
          if (querySnapshot && !querySnapshot.empty) {
            const user2Doc = querySnapshot.docs[0];
            console.log(user2Doc.data());
            const user2Data = user2Doc.data() as DocumentData;  
            const user2Id = user2Data['uid'];

          //add user to board
          const boardcollection: AngularFirestoreCollection<Board> = this.firestoreDB.collection(`boards`);
          const boardDoc = boardcollection.doc(`${board.id}`);
          const boardUsersCollection = boardDoc.collection(`boardUsers`);
          const boarduser : BoardUser = {
            uid: user2Id
          } 
          const boardUser = boardUsersCollection.doc(`${user2Id}`).set(boarduser);

          //add board to user
          const userscollection: AngularFirestoreCollection<User> = this.firestoreDB.collection(`users`);
          const userDoc = userscollection.doc(`${user2Id}`);
          const usersBoardCollection = userDoc.collection(`userBoards`);
          const userboard : UserBoard = {
            boardId: board.id
          } 
          const userBoard = usersBoardCollection.doc(`${board.id}`).set(userboard);
          return board.id;
       } else {
           // Handle case when user2 is not found
           console.log('User not found.');
           throw new Error('User not found.');
       }
   } catch (error) {
       // Handle error while fetching user data or adding data to Firestore
       console.error(error);
       throw error;
   }
      
 }
}
