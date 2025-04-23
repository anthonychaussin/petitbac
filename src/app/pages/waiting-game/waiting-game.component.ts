import {AsyncPipe} from '@angular/common';
import {Component, inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  IonCol,
  IonContent, IonGrid, IonRow,
  IonSpinner
} from '@ionic/angular/standalone';
import {Store} from '@ngrx/store';
import {filter} from 'rxjs';
import {map} from 'rxjs/operators';
import {Player} from '../../Models/Player';
import {loadGameParams, loadGameStatus} from '../../state/game/game.actions';
import {selectGameParams, selectGameStatus} from '../../state/game/game.selectors';
import {loadPlayers} from '../../state/player/player.actions';
import {selectPlayerList} from '../../state/player/player.selectors';
import {loadTurn} from '../../state/turn/turn.actions';
import {selectTurnData} from '../../state/turn/turn.selectors';

@Component({
             selector: 'app-waiting-game',
             templateUrl: './waiting-game.component.html',
             styleUrls: ['./waiting-game.component.scss'],
             imports: [
               IonContent,
               IonSpinner,
               AsyncPipe,
               IonGrid,
               IonRow,
               IonCol
             ]
           })
export class WaitingGamePage {

  private store: Store = inject(Store);
  private router: Router = inject(Router);

  gameId = '';
  players$ = this.store.select(selectPlayerList).pipe(map(players => players.filter((player: Player) => !player.host)));
  turn$ = this.store.select(selectTurnData);
  game$ = this.store.select(selectGameParams);
  gameStatus$ = this.store.select(selectGameStatus);

  uid = localStorage.getItem('uid') || '';

  allDone$ = this.players$.pipe(
    filter(players => players?.length > 0),
    map(players => players.every((p: { done: boolean; }) => p.done))
  );

  constructor(
    private route: ActivatedRoute,
  ) {
    this.gameId = this.route.snapshot.paramMap.get('code')!;

    this.store.dispatch(loadPlayers({ gameId: this.gameId }));
    this.store.dispatch(loadTurn({ gameId: this.gameId }));
    this.store.dispatch(loadGameParams({gameId: this.gameId}));
    this.store.dispatch(loadGameStatus({ gameId: this.gameId }));

    const playerSubscriber = this.players$.pipe(map(players => players.filter(player => player && player.uid === this.uid))).subscribe(players => {
      if(players?.length == 1 && !players[0].done){
        this.router.navigate([`/game/${this.gameId}`]).then(() => playerSubscriber.unsubscribe());
      }
    });
    const gameSubscriber = this.gameStatus$.subscribe(status => {
      if(status === 'terminated'){
        this.router.navigate([`/end-game/${this.gameId}`]).then(() => {
          playerSubscriber.unsubscribe();
          gameSubscriber.unsubscribe();
        });
      }
    })
  }

}
