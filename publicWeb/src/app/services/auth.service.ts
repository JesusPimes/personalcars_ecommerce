import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

//import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap, first, map } from 'rxjs/operators';
import { User } from './user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user$: Observable<any>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  googleSignIn() {
   // const provider = new auth.GoogleAuthProvider();
   // return this.oAuthLogin(provider);
  }

  async getUser() {
    return this.afAuth.authState.pipe(first()).toPromise();
  }


  private async oAuthLogin(provider) {
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    return this.updateUserData(credential.user);
  }

  private updateUserData({ uid, email, displayName, photoURL }: User) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${uid}`);

    const data = {
      uid,
      email,
      displayName,
      photoURL
    };

    return userRef.set(data, { merge: true });
  }

  async signOut() {
    await this.afAuth.auth.signOut();
    window.location.reload()
  }
  customSignIn(token) {

    var promise = new Promise((resolve, reject) => {
        this.afAuth.auth.signInWithCustomToken(token).then((user) =>{
      //    console.log(user)
        resolve(user)
        })
    })
    return promise;
  }
}
