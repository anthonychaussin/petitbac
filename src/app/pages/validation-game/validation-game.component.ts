import {AsyncPipe} from '@angular/common';
import {Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {
  IonButton,
  IonCard, IonCardContent,
  IonCardTitle,
  IonCheckbox,
  IonCol,
  IonContent,
  IonGrid,
  IonItem,
  IonLabel,
  IonRow,
  IonText
} from '@ionic/angular/standalone';
import {Store} from '@ngrx/store';
import {filter, firstValueFrom, take} from 'rxjs';
import {map} from 'rxjs/operators';
import {GameService} from '../../services/game.service';
import {PlayerService} from '../../services/player.service';
import {loadGameParams, loadGameStatus} from '../../state/game/game.actions';
import {selectGameParams, selectGameStatus} from '../../state/game/game.selectors';
import {loadPlayers} from '../../state/player/player.actions';
import {selectPlayerList} from '../../state/player/player.selectors';
import {loadTurn} from '../../state/turn/turn.actions';
import {selectTurnData} from '../../state/turn/turn.selectors';

@Component({
             selector: 'app-validation-game',
             templateUrl: './validation-game.component.html',
             styleUrls: ['./validation-game.component.scss'],
             imports: [
               IonContent,
               IonGrid,
               IonCol,
               IonRow,
               IonItem,
               IonLabel,
               IonCheckbox,
               FormsModule,
               IonButton,
               AsyncPipe,
               IonText,
               IonCard,
               IonCardTitle,
               IonCardContent
             ]
           })
export class ValidationGamePage {

  private store: Store = inject(Store);
  private playerService: PlayerService = inject(PlayerService);
  private gameService: GameService = inject(GameService);
  private router: Router = inject(Router);

  gameId = '';
  players$ = this.store.select(selectPlayerList).pipe(map(players => players.filter(player => !player.host && player.done)));
  turn$ = this.store.select(selectTurnData);
  game$ = this.store.select(selectGameParams);
  gameStatus$ = this.store.select(selectGameStatus);
  allDone$ = this.players$.pipe(
    filter(players => players?.length > 0),
    map(players => players.every((p: { done: boolean; }) => p.done))
  );

  validationMap: Record<string, Record<string, boolean>> = {};
  uid = localStorage.getItem('uid') || crypto.randomUUID();

  constructor(
    private route: ActivatedRoute,
  ) {
    this.gameId = this.route.snapshot.paramMap.get('code')!;

    this.store.dispatch(loadPlayers({ gameId: this.gameId }));
    this.store.dispatch(loadTurn({ gameId: this.gameId }));
    this.store.dispatch(loadGameParams({gameId: this.gameId}));
    this.store.dispatch(loadGameStatus({ gameId: this.gameId }));

    const playerSubscriber = this.players$.subscribe(players => {
      if (!players) return;
      for (const player of players) {
        if (!this.validationMap[player.uid]) {
          this.validationMap[player.uid] = {};
        }
      }
    });
    const gameSubscriber = this.gameStatus$.subscribe(status => {
      if(status === 'started'){
        this.turn$.pipe(take(1)).subscribe(turn => {
          this.gameService.startTimer(this.gameId, turn.timer);
        })
      }
      if(status === 'terminated'){
        this.router.navigate([`/end-game/${this.gameId}`]).then(() => {
          playerSubscriber.unsubscribe();
          gameSubscriber.unsubscribe();
        });
      }
    });
  }

  toggleValidation(uid: string, category: string) {
    this.validationMap[uid][category] = !this.validationMap[uid][category];
  }

  async validateRound() {
    const players = await firstValueFrom(this.players$);

    for (const player of players) {
      let score = 0;
      const answers = player.answers || {};

      for (const [string, answer] of answers) {
        const isValid = answer.valide ?? true;
        if (isValid && answer) {
          score++;
        }
      }

      this.playerService.updateScore(this.gameId, player, (player.score || 0) + score);
    }


    this.turn$.pipe(filter(turn => turn), take(1)).subscribe(turn => {
      this.game$.pipe(take(1)).subscribe(game => {
        if(game.turns >= turn.id){
          this.gameService.nextTurn(this.gameId, turn.id + 1, turn, game.timer);
        } else {
          this.gameService.endGame(this.gameId).then(() => {
            this.router.navigate(['end-game/'+this.gameId]);
          });
        }
      });
    });
  }

  getTimerColor(t: number): string {
    if (t > 20) return 'success';
    if (t > 10) return 'warning';
    return 'danger';
  }
}
