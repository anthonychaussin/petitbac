import {inject, Injectable} from '@angular/core';
import {FirebaseApp} from '@angular/fire/app';
import {Database, getDatabase, onValue, ref} from '@angular/fire/database';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Observable} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {loadTurn, loadTurnSuccess} from './turn.actions';

@Injectable()
export class TurnEffects {
  private db: Database = getDatabase(inject(FirebaseApp));

  loadTurn$ = createEffect(() =>
                             this.actions$.pipe(
                               ofType(loadTurn),
                               switchMap(({gameId}) => {
                                 return new Observable<any>(observer => {
                                   onValue(ref(this.db, `games/${gameId}/current`), snapshot => {
                                     let data = snapshot.val();
                                     observer.next(loadTurnSuccess({data}));
                                   });
                                 });
                               })
                             )
  );

  constructor(private actions$: Actions) {}

}
