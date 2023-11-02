import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, CollectionReference, DocumentData, DocumentReference, QuerySnapshot } from '@angular/fire/compat/firestore';
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


    // add user
    addUser(user: User): Promise<void> {
        const userRef: AngularFirestoreDocument<any> = this.firestoreDB.doc(
          `users/${user.uid}`
        );
        return userRef.set(user, { merge: true });
    }

    getUserData(uid: string): Observable<any> {
        return this.firestoreDB.collection('users').doc(`${uid}`).valueChanges();
    }
    // get users
    geAllUsers() {
        return this.firestoreDB.collection('users').snapshotChanges();
    }

    // delete user
    deleteUser(user: User) {
      this.firestoreDB.collection('users').doc(`${user.uid}`).delete();
      const boardsCollection = this.firestoreDB.collection('boards').doc(`${user.uid}`).delete();
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

    async deleteBoard(boardInfo: Board): Promise<void> {
      const boardsCollection = this.firestoreDB.collection(`boards`);
      const usersCollection = this.firestoreDB.collection(`users`);
    
      // Delete the board from the boards collection.
      await boardsCollection.doc(`${boardInfo.id}`).delete();
    
      // Get all users who have access to the board.
      const userBoardsCollection = this.firestoreDB.collection(`boards`).doc(`${boardInfo.id}`).collection('boardUsers');
      
      // Get an observable for the userBoards collection
      const userBoardDocs$: Observable<QuerySnapshot<DocumentData>> = userBoardsCollection.get();
    
      // Subscribe to the observable
      userBoardDocs$.subscribe((userBoardDocs: QuerySnapshot<DocumentData>) => {
        const batch = this.firestoreDB.firestore.batch();
    
        // Iterate through the documents in the observable result and extract DocumentReference
        userBoardDocs.docs.forEach(doc => {
          const docRef: DocumentReference = doc.ref; // Obtain DocumentReference from QueryDocumentSnapshot
          batch.delete(docRef);
        });
    
        // Commit the batch operation to delete board references from userBoards collection.
        batch.commit().then(() => {
          console.log('Batch delete successful.');
        }).catch(error => {
          console.error('Error deleting board references:', error);
        });
      });
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
          const boardDoc = boardcollection.doc(`${list.board_id}`);
          const listcollection = boardDoc.collection(`lists`);
          const listDoc = listcollection.doc(`${list.id}`);
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
        const userscollection: AngularFirestoreCollection<User> = this.firestoreDB.collection(`users`);
        const userDoc = userscollection.doc(`${user.uid}`);
        const userBoardsCollection: AngularFirestoreCollection<UserBoard>  = userDoc.collection(`userBoards`);
        return userBoardsCollection
        .valueChanges();
       
    }


    async addUserToBoard(board: Board, email: string): Promise<any> {

        try {

          // Find the user2 with the specified email
          const querySnapshot = await this.firestoreDB.collection('users', ref => ref.where('email', '==', email)).get().toPromise();      
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
