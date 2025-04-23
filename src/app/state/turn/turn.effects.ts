import { Injectable, inject } from '@angular/core';
import {FirebaseApp} from '@angular/fire/app';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {Database, ref, onValue, getDatabase} from '@angular/fire/database';
import {Store} from '@ngrx/store';
import {interval, Observable} from 'rxjs';
import { loadTurn, loadTurnSuccess } from './turn.actions';
import {map, switchMap, takeUntil} from 'rxjs/operators';

@Injectable()
export class TurnEffects {
  private db: Database = getDatabase(inject(FirebaseApp));

  loadTurn$ = createEffect(() =>
                             this.actions$.pipe(
                               ofType(loadTurn),
                               switchMap(({ gameId }) => {
                                 return new Observable<any>(observer => {
                                   onValue(ref(this.db, `games/${gameId}/current`), snapshot => {
                                     let data = snapshot.val();
                                     observer.next(loadTurnSuccess({ data }));
                                   });
                                 });
                               })
                             )
  );

  constructor(private actions$: Actions) {}

}
