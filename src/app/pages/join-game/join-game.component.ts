import {Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {IonButton, IonContent, IonInput, IonItem, IonLabel} from '@ionic/angular/standalone';
import { PlayerService } from '../../services/player.service';

@Component({
             selector: 'app-join-game',
             templateUrl: './join-game.component.html',
             imports: [
               IonContent,
               IonItem,
               IonLabel,
               IonInput,
               IonButton,
               FormsModule
             ]
           })
export class JoinGamePage {
  gameId = '';
  pseudo = '';
  private playerService: PlayerService = inject(PlayerService);
  protected status?: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.gameId = this.route.snapshot.paramMap.get('code')!;
  }

  joinGame() {
    if (!this.pseudo.trim()) return;

      this.playerService.addPlayerToGame(this.gameId, this.pseudo.trim(), window.crypto.randomUUID(), undefined).subscribe(result => {
        if(result) {
          this.router.navigate(['/salle-attente', this.gameId]).then();
        }
      });
  }
}
