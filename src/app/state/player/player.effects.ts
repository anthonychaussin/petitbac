import { Injectable, inject } from '@angular/core';
import {FirebaseApp} from '@angular/fire/app';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {Database, ref, onChildAdded, onChildRemoved, onChildChanged, getDatabase} from '@angular/fire/database';
import {Observable, ReplaySubject} from 'rxjs';
import {Player} from '../../Models/Player';
import {loadPlayers, loadPlayersSuccess} from './player.actions';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class PlayerEffects {
  private db: Database = getDatabase(inject(FirebaseApp));

  loadPlayers$ = createEffect(() =>
                                this.actions$.pipe(
                                  ofType(loadPlayers),
                                  switchMap(({ gameId }) => {
                                    const syncPlayerList= new Map<string, Player>();
                                    const playerList = new ReplaySubject<Player[]>(1);
                                    const playerRef = ref(this.db, `games/${gameId}/players`);

                                    onChildAdded(playerRef, (data) => {
                                      const player = new Player(data.key!, data.val());
                                      syncPlayerList.set(player.uid, player);
                                      playerList.next(Array.from(syncPlayerList.values()));
                                    });

                                    onChildChanged(playerRef, (data) => {
                                      const player = new Player(data.key!, data.val());
                                      if(syncPlayerList.has(player.uid)){
                                        syncPlayerList.set(player.uid, player);
                                      } else {
                                        syncPlayerList.set(player.uid, player);
                                      }
                                      playerList.next(Array.from(syncPlayerList.values()));
                                    });

                                    onChildRemoved(playerRef, (data) => {
                                      const player = new Player(data.key!, data.val());
                                      if(syncPlayerList.has(player.uid)){
                                        syncPlayerList.delete(player.uid);
                                        playerList.next(Array.from(syncPlayerList.values()));
                                      }
                                    });

                                    return new Observable<any>(observer => {
                                      playerList.asObservable().subscribe(players => {
                                        if(players.length > 0){
                                          observer.next(loadPlayersSuccess({ data: players }));
                                        }
                                      });
                                    });
                                  })
                                )
  );

  constructor(private actions$: Actions) {}
}
