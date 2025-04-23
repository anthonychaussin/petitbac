import {AsyncPipe} from '@angular/common';
import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {IonButton, IonContent, IonInput, IonItem, IonLabel, IonList} from '@ionic/angular/standalone';
import {Store} from '@ngrx/store';
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
               IonInput,
               AsyncPipe
             ]
           })
export class WaitingRoomPage implements OnInit {

  private store = inject(Store);
  private gameService: GameService = inject(GameService);
  private router: Router = inject(Router);

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
    });
    const gameSubscriber = this.status$.subscribe(status => {
      if (status == 'started') {
        if(this.host) {
          this.router.navigate(['/validation-game/' + this.gameId]);
        } else {
          this.router.navigate(['/game/'+this.gameId]);
        }
      }
    })
  }

  ngOnInit(): void {
    this.game$.subscribe(game => {
    if (!game) return;
    if (game.status === 'started') {
      this.redirectOnGameStart();
    }
  });
  }

  startGame() {
      this.gameService.startGame(this.gameId, {letter: undefined}).then(game => {
        if(this.host){
          this.router.navigate(['/validation-game/'+this.gameId]);

        } else {
          this.router.navigate(['/game/'+this.gameId]);
        }

      });
  }

  get shareUrl(): string {
    return `${window.location.origin}/partie/${this.gameId}`;
  }

  copyLink() {
    navigator.clipboard.writeText(this.shareUrl).then(() => {
      alert('Lien copié ✅');
    });
  }

  async redirectOnGameStart() {
    const isHost = localStorage.getItem('host') === 'true';
    if (isHost) {
      return await this.router.navigate(['/validation-game', this.gameId]);
    } else {
      return await this.router.navigate(['/game', this.gameId]);
    }
  }
}
