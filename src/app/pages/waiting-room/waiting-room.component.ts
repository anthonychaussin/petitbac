import {AsyncPipe} from '@angular/common';
import {Component, inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  IonButton,
  IonCard, IonCardContent, IonCardSubtitle,
  IonCardTitle,
  IonContent, IonGrid,
  IonItem,
  IonLabel,
  IonList, IonRow,
  ToastController
} from '@ionic/angular/standalone';
import {Store} from '@ngrx/store';
import {take} from 'rxjs';
import {Player} from '../../Models/Player';
import {GameService} from '../../services/game.service';
import {loadGameParams, loadGameStatus} from '../../state/game/game.actions';
import {selectGameParams, selectGameStatus} from '../../state/game/game.selectors';
import {loadPlayers} from '../../state/player/player.actions';
import {selectPlayerList} from '../../state/player/player.selectors';

@Component({
             selector: 'app-waiting-room',
             templateUrl: './waiting-room.component.html',
             imports: [
               IonContent,
               IonList,
               IonItem,
               IonLabel,
               IonButton,
               AsyncPipe,
               IonCard,
               IonCardTitle,
               IonCardSubtitle,
               IonCardContent,
               IonRow,
               IonGrid
             ]
           })
export class WaitingRoomPage {

  private store = inject(Store);
  private gameService: GameService = inject(GameService);
  private router: Router = inject(Router);
  private toastController: ToastController = inject(ToastController);

  players$ = this.store.select(selectPlayerList);
  game$ = this.store.select(selectGameParams);
  status$ = this.store.select(selectGameStatus);

  gameId = '';
  uid = localStorage.getItem('uid') || crypto.randomUUID();
  host = false;

  constructor(
    private route: ActivatedRoute,
  ) {
    this.gameId = this.route.snapshot.paramMap.get('code')!;

    localStorage.setItem('uid', this.uid);

    this.store.dispatch(loadPlayers({ gameId: this.gameId }));
    this.store.dispatch(loadGameParams({ gameId: this.gameId }));
    this.store.dispatch(loadGameStatus({ gameId: this.gameId }));

    const playerSubscriber = this.players$.subscribe(players => {
      if(!this.host) {
        this.host = players.some((player: Player) => player.uid === this.uid && player.host);
      } else {
        playerSubscriber.unsubscribe();
      }

      const gameSubscriber = this.status$.subscribe(status => {
        if (status == 'started') {
          this.redirectOnGameStart().then(() => gameSubscriber.unsubscribe());
        }
      });
    });
  }

  startGame() {
    this.game$.pipe(take(1)).subscribe(game => {
      this.gameService.startGame(this.gameId, {letter: undefined}, game.timer).then(game => {
        this.redirectOnGameStart().then();
      });
    });
  }

  get shareUrl(): string {
    return `${window.location.origin}/partie/${this.gameId}`;
  }

  copyLink() {
    navigator.clipboard.writeText(this.shareUrl).then(async () => {
      const toast = await this.toastController.create({
                                                          message: 'Lien d\invitation copié ! ✅',
                                                          duration: 1500,
                                                          position: 'bottom',
                                                        });

        await toast.present();
    });
  }

  async redirectOnGameStart() {
    if (this.host) {
      return await this.router.navigate(['/validation-game', this.gameId]);
    } else {
      return await this.router.navigate(['/game', this.gameId]);
    }
  }
}
