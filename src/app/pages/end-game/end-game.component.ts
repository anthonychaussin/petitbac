import {AsyncPipe} from '@angular/common';
import {AfterViewInit, Component, inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  IonButton,
  IonCard, IonCardContent,
  IonCardHeader, IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonRow
} from '@ionic/angular/standalone';
import {Store} from '@ngrx/store';
import {map} from 'rxjs/operators';
import {Player} from '../../Models/Player';
import {GameService} from '../../services/game.service';
import {loadPlayers} from '../../state/player/player.actions';
import {selectPlayerList} from '../../state/player/player.selectors';

@Component({
             selector: 'app-end-game',
             templateUrl: './end-game.component.html',
             styleUrls: ['./end-game.component.scss'],
             imports: [
               IonContent,
               IonButton,
               AsyncPipe,
               IonIcon,
               IonGrid,
               IonRow,
               IonCol,
               IonCard,
               IonCardHeader,
               IonCardTitle,
               IonCardContent
             ]
           })
export class EndGameComponent {
  private store: Store = inject(Store);
  private router: Router = inject(Router);
  private gameService: GameService = inject(GameService);

  gameId = '';
  players$ = this.store.select(selectPlayerList).pipe(map(players => {
    players = players.filter(player => !player.host);
    players.sort(this.sortByScore);
    return players;
  }));


  sortByScore = (a: Player, b: Player) => {
    const scoreA = a.score || 0;
    const scoreB = b.score || 0;
    return scoreB - scoreA;
  };

  constructor(
    private route: ActivatedRoute,
  ) {
    this.gameId = this.route.snapshot.paramMap.get('code')!;

    this.store.dispatch(loadPlayers({ gameId: this.gameId }));
  }

  async replay() {
    this.gameService.restartGame(this.gameId).then(() => this.router.navigate(['/salle-attente', this.gameId]));
  }

  getPodiumColor(index: number): string {
    if (index === 0) return 'warning';
    if (index === 1) return 'light';
    if (index === 2) return 'tertiary';
    return 'medium';
  }

  getMedalEmoji(index: number): string {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return '';
  }
}
