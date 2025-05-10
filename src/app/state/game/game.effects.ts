import {inject, Injectable} from '@angular/core';
import {FirebaseApp} from '@angular/fire/app';
import {Database, getDatabase, onValue, ref} from '@angular/fire/database';
import {doc, Firestore, getDoc} from '@angular/fire/firestore';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {loadGameParams, loadGameParamsFailure, loadGameParamsSuccess, loadGameStatus, loadGameStatusSuccess} from './game.actions';

@Injectable()
export class GameEffects {
  private db: Database = getDatabase(inject(FirebaseApp));
  private firestore: Firestore = inject(Firestore);

  loadGameParams$ = createEffect(() =>
                                   this.actions$.pipe(
                                     ofType(loadGameParams),
                                     switchMap(({gameId}) =>
                                                 getDoc(doc(this.firestore, 'parties', gameId))
                                                   .then(snapshot => {
                                                     if (snapshot.exists()) {
                                                       return loadGameParamsSuccess({params: snapshot.data()});
                                                     } else {
                                                       throw new Error('Partie non trouvée');
                                                     }
                                                   })
                                                   .catch(error => loadGameParamsFailure({error}))
                                     )
                                   )
  );

  loadGameStatus$ = createEffect(() =>
                                   this.actions$.pipe(
                                     ofType(loadGameStatus),
                                     switchMap(({gameId}) =>
                                                 new Observable<any>(observer =>
                                                                       onValue(ref(this.db, 'games/' + gameId + '/status'), (snapshot) =>
                                                                         observer.next(loadGameStatusSuccess({status: snapshot.val()})))))));

  constructor(private actions$: Actions, private store: Store) {}
}
