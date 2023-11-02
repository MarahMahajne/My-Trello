import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
// import { Timestamp } from 'firebase/firestore';
import { timestamp } from 'rxjs';



export interface Board {
    id: string;
    creator_uid: string;
    title: string;
    // created_at: firebase.firestore.FieldValue;
}

