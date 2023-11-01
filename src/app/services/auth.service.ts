import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { Injectable, NgZone } from '@angular/core';
import { UserCredential } from 'firebase/auth';
//import { User } from '../user';
import {
    AngularFirestore,
    AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import * as auth from 'firebase/auth';
import { User } from '../model/user';
import { GoogleAuthProvider,  GithubAuthProvider, FacebookAuthProvider, user} from '@angular/fire/auth';
import { UserService } from './user.service';
import { FirebaseError } from '@angular/fire/app';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    userData: any; // Save logged in user data
    uid: String ="";
    
    constructor(public fireauth: AngularFireAuth, private router: Router, public fireStore: AngularFirestore, public ngZone: NgZone, public userService: UserService) {
        this.fireauth.authState.subscribe((user) => {
            if (user) {
                this.uid = user.uid;
                localStorage.setItem('user', JSON.stringify(user));
                JSON.parse(localStorage.getItem('user')!);
            } else {
                localStorage.setItem('user', 'null');
                JSON.parse(localStorage.getItem('user')!);
            }
        });
    }
    
    async SignIn(email: string, password: string) {
        try {
          const result = await this.fireauth.signInWithEmailAndPassword(email, password);
          this.fireauth.authState.subscribe((user) => {
            if (user) {
              alert("Success"); // Display success message here
              console.log("hi");
              this.router.navigate(['/workspace', user.uid]);
              localStorage.setItem('token', JSON.stringify(user.uid));
              console.log("hi");
            }
          });
        } catch (error) {
            if (error instanceof FirebaseError) {
                window.alert(error.message); // Display Firebase error message
              } else {
                window.alert('An unknown error occurred.'); // Handle other types of errors
              }
              this.router.navigate(['/login'])
        }
      }
      
    
    async googleSignIn() {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' }); // Set the prompt parameter
    
        try {
            const result = await this.fireauth.signInWithPopup(provider);
            const user = result.user;
            
            if (user) {
                const userData: User = {
                    uid: user.uid || '',
                    email: user.email || '',
                    username: user.displayName || '',
                    photoURL: user.photoURL || '',
                    emailVerified: user.emailVerified
                    // Add other properties as needed
                };
    
                await this.userService.addUser(userData);
                this.userData = userData;
                this.router.navigate(['/workspace', user.uid]);
                localStorage.setItem('token', JSON.stringify(user.uid));
            }
    
        } catch (error: any) { // Specify 'any' type for error
            window.alert(error.message);
            this.router.navigate(['/login']);
        }
    }
    


    //sign in with facebook
    async facebookSignIn() {
        return await this.fireauth
            .signInWithPopup(new FacebookAuthProvider)
            .then((result) => {
                this.fireauth.authState.subscribe((user) => {
                    if (user) {
                        alert("success")
                        this.router.navigate(['/workspace', user.uid])
                        localStorage.setItem('token',JSON.stringify( user.uid))
                    }
                });
            })
            .catch((error) => {
                window.alert(error.message);
                this.router.navigate(['/login'])

            });
    }

    //sign in with google
    async gitHubSignIn() {
        return await this.fireauth
            .signInWithPopup(new GithubAuthProvider)
            .then((result) => {
                this.fireauth.authState.subscribe((user) => {
                    if (user) {
                        alert("success")
                        this.router.navigate(['/workspace', user.uid])
                        localStorage.setItem('token',JSON.stringify( user.uid))
                    }
                });
            })
            .catch((error) => {
                window.alert(error.message);
                this.router.navigate(['/login'])

            });
    }


    // async SignUp(password: string, userData: User) {
    //     return await this.fireauth
    //         .createUserWithEmailAndPassword(userData.email, password)
    //         .then((result) => {
    //             /* Call the SendVerificaitonMail() function when new user sign 
    //             up and returns promise */
               
    //             this.SendVerificationMail();
    //             userData.emailVerified = true;
    //             if (result.user?.uid) {
    //                 userData.uid= result.user.uid;
    //             }
    //             this.router.navigate(['/workspace', userData.uid]);
    //             this.userData = user;
    //             this.userService.addUser(userData)

    //         })
    //         .catch((error) => {
    //             window.alert(error.message);
    //         });
    // }



   // Sign up function
  async SignUp(email: string, password: string, username: string) {
    try {
      const result = await this.fireauth.createUserWithEmailAndPassword(email, password);
      const user = result.user;
      var emailVerified = false;


      // Send verification email
      await this.SendVerificationMail();
      emailVerified = true;
     

      // Save user data to Firestore
      const userData: User = {
        uid:  result.user?.uid || '', // Use optional chaining to avoid null/undefined error
        email: email,
        username: username,
        photoURL:"",
        emailVerified: emailVerified
        // Add other properties as needed
      };

      await this.userService.addUser(userData);
      this.userData = userData;
    //   this.router.navigate(['/workspace', userData.uid]);
      // Redirect to workspace
    } catch (error) {
      console.error('Error signing up:', error);
      // Handle error here (show message to user, etc.)
    }
  }

    // Send email verfificaiton when new user sign up
    async SendVerificationMail() {
        console.log("i am in SendVerificationMail")
        return await this.fireauth.currentUser
            .then((u: any) => u.sendEmailVerification())
            .then(() => {
                this.router.navigate(['/verify-email']);
            });
    }

    
    
    // Reset Forggot password
    async ForgotPassword(passwordResetEmail: string) {
        return await this.fireauth
            .sendPasswordResetEmail(passwordResetEmail)
            .then(() => {
                window.alert('Password reset email sent, check your inbox.');
            })
            .catch((error) => {
                window.alert(error);
            });
    }
    // Returns true when user is looged in and email is verified
    get isLoggedIn(): boolean {
        const user = JSON.parse(localStorage.getItem('user')!);
        return user !== null && user.emailVerified !== false ? true : false;
    }
    /* Setting up user data when sign in with username/password, 
    sign up with username/password and sign in with social auth  
    provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */

    // Sign out
    async SignOut() {
        return await this.fireauth.signOut().then(() => {
            localStorage.removeItem('user');
            this.router.navigate(['/login']);
        });
    }

    // getCurrentUser(): User | null {
    //     const userString = localStorage.getItem('user');
    //     if (userString) {
    //         const user: User = JSON.parse(userString);
    //         return user;
    //     }
    //     return null;
    // }
}