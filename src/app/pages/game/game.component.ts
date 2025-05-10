import {AsyncPipe} from '@angular/common';
import {Component, inject, OnDestroy} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonText,
  ToastController
} from '@ionic/angular/standalone';
import {Store} from '@ngrx/store';
import {filter, Subscription} from 'rxjs';
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
               AsyncPipe,
               IonCard,
               IonCardContent
             ]
           })

export class GamePage implements OnDestroy {
  private answerService: AnswerService = inject(AnswerService);
  private router: Router = inject(Router);
  private store = inject(Store);
  private toastController: ToastController = inject(ToastController);

  gameId = '';
  gameParams$ = this.store.select(selectGameParams);
  turn$ = this.store.select(selectTurnData);
  gameStatus$ = this.store.select(selectGameStatus);

  uid = localStorage.getItem('uid') || crypto.randomUUID();
  answers: Record<string, string> = {};
  submitted = false;
  private turnSubscriber: Subscription;


  constructor(
    private route: ActivatedRoute,
  ) {
    this.gameId = this.route.snapshot.paramMap.get('code')!;
    this.store.dispatch(loadGameParams({ gameId: this.gameId }));
    this.store.dispatch(loadTurn({ gameId: this.gameId }));
    this.store.dispatch(loadGameStatus({ gameId: this.gameId }));

    let started = false;
    this.turnSubscriber = this.turn$.pipe(filter(turn => turn),).subscribe(turn => {
      if(turn.timer == 0 && started) {
        this.submit();
        this.turnSubscriber.unsubscribe();
      }
      if (turn.timer > 0){
        started = true;
      }
    });

    const gameSubscriber = this.gameStatus$.subscribe(status => {
      if(status === 'terminated'){
        this.router.navigate([`/end-game/${this.gameId}`]).then(() => {
          this.turnSubscriber.unsubscribe();
          gameSubscriber.unsubscribe();
        });
      }
    })
  }

  getTimerColor(t: number): string {
    if (t > 20) return 'success';
    if (t > 10) return 'warning';
    return 'danger';
  }

  async submit() {
    if (this.submitted) return;
    this.submitted = true;

    this.answerService.submitAnswersToPlayerNode(this.gameId, this.uid, this.answers).then(async () => {
      this.turnSubscriber.unsubscribe();
      const toast = await this.toastController.create({
                                                        message: 'Réponses envoyées ✅',
                                                        duration: 1500,
                                                        position: 'bottom',
                                                      });

      await toast.present();
      this.router.navigate([`/waiting-game/${this.gameId}`]);
    });
  }

  ngOnDestroy(): void {
    this.turnSubscriber.unsubscribe();
  }
}
