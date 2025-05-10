import {Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonInput,
  IonItem,
  IonLabel
} from '@ionic/angular/standalone';
import { PlayerService } from '../../services/player.service';

@Component({
             selector: 'app-join-game',
             templateUrl: './join-game.component.html',
             styleUrls: ['./join-game.component.scss'],
             imports: [
               IonContent,
               IonItem,
               IonLabel,
               IonInput,
               IonButton,
               FormsModule,
               IonCard,
               IonCardTitle,
               IonCardSubtitle,
               IonCardContent
             ]
           })
export class JoinGamePage {

  private router: Router = inject(Router);

  gameId = '';
  pseudo = '';
  private playerService: PlayerService = inject(PlayerService);
  protected status?: string;
  uid = localStorage.getItem('uid') || crypto.randomUUID();

  constructor(
    private route: ActivatedRoute,
  ) {
    this.gameId = this.route.snapshot.paramMap.get('code')!;
  }

  joinGame() {
    if (!this.pseudo.trim()) return;

      this.playerService.addPlayerToGame(this.gameId, this.pseudo.trim(), this.uid, undefined).then(() => {
          this.router.navigate(['/salle-attente', this.gameId]).then();
      });
  }
}
