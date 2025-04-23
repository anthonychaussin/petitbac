import {AsyncPipe} from '@angular/common';
import {Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {IonButton, IonContent, IonInput, IonItem, IonLabel, IonList, IonText} from '@ionic/angular/standalone';
import {Store} from '@ngrx/store';
import {filter} from 'rxjs';
import { AnswerService } from '../../services/answer.service';
import {loadGameParams, loadGameStatus} from '../../state/game/game.actions';
import {selectGameParams, selectGameStatus} from '../../state/game/game.selectors';
import {loadTurn} from '../../state/turn/turn.actions';
import {selectTurnData} from '../../state/turn/turn.selectors';

@Component({
             selector: 'app-game',
             templateUrl: './game.component.html',
             imports: [
               IonContent,
               IonList,
               IonLabel,
               IonItem,
               IonInput,
               FormsModule,
               IonButton,
               IonText,
               AsyncPipe
             ]
           })

export class GamePage {
  private answerService: AnswerService = inject(AnswerService);
  private router: Router = inject(Router);
  private store = inject(Store);

  gameId = '';
  gameParams$ = this.store.select(selectGameParams);
  turn$ = this.store.select(selectTurnData);
  gameStatus$ = this.store.select(selectGameStatus);

  uid = localStorage.getItem('uid') || crypto.randomUUID();
  answers: Record<string, string> = {};
  submitted = false;


  constructor(
    private route: ActivatedRoute,
  ) {
    this.gameId = this.route.snapshot.paramMap.get('code')!;
    this.store.dispatch(loadGameParams({ gameId: this.gameId }));
    this.store.dispatch(loadTurn({ gameId: this.gameId }));
    this.store.dispatch(loadGameStatus({ gameId: this.gameId }));

    let started = false;
    const turnSubscriber = this.turn$.pipe(filter(turn => turn),).subscribe(turn => {
      if(turn.timer == 0 && started) {
        this.submit();
      }
      if (turn.timer > 0){
        started = true;
      }
    });

    const gameSubscriber = this.gameStatus$.subscribe(status => {
      if(status === 'terminated'){
        this.router.navigate([`/end-game/${this.gameId}`]).then(() => {
          turnSubscriber.unsubscribe();
          gameSubscriber.unsubscribe();
        });
      }
    })
  }

  async submit() {
    if (this.submitted) return;
    this.submitted = true;

    this.answerService.submitAnswersToPlayerNode(this.gameId, this.uid, this.answers).then(() => {
      alert('Réponses envoyées ✅');
      this.router.navigate([`/waiting-game/${this.gameId}`]);
    });
  }
}
