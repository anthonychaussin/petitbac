import {inject, Injectable} from '@angular/core';
import {FirebaseApp} from '@angular/fire/app';
import {Database, getDatabase, ref, set, update} from '@angular/fire/database';
import {Store} from '@ngrx/store';
import {BehaviorSubject} from 'rxjs';
import {Player} from '../Models/Player';
import {selectPlayerList} from '../state/player/player.selectors';
import {AnswerService} from './answer.service';

@Injectable({providedIn: 'root'})
export class PlayerService {

  private db: Database = getDatabase(inject(FirebaseApp));
  private answerService: AnswerService = inject(AnswerService);
  private store: Store= inject(Store);
  private players$ = this.store.select(selectPlayerList);


  addPlayerToGame(gameId: string, pseudo: string, playerId: string, host_id: string|undefined) {
    const added = new BehaviorSubject<boolean>(false);
    set(ref(this.db, 'games/' + gameId + '/players/'+playerId), {pseudo : pseudo, score: 0, host: host_id!=undefined}).then(result => {
      added.next(true);
    }).catch(e => console.error(e));
    return added.asObservable();
  }

	async updateScore(gameId: string, player: Player, number: number): Promise<void> {
    if(number > 0){
      await update(ref(this.db, 'games/' + gameId + '/players/'+player.uid), {score: number});
    }

    return await this.answerService.resetAnswerToPlayerNode(gameId, player.uid, new Map(Array.from(player.answers.keys()).map(key => [key, ""])));
	}
}
