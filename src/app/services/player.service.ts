import {inject, Injectable} from '@angular/core';
import {FirebaseApp} from '@angular/fire/app';
import {Database, getDatabase, ref, set, update} from '@angular/fire/database';
import {Store} from '@ngrx/store';
import {BehaviorSubject} from 'rxjs';
import {Player} from '../Models/Player';
import {AnswerService} from './answer.service';

@Injectable({providedIn: 'root'})
export class PlayerService {

  private db: Database = inject(Database);
  private answerService: AnswerService = inject(AnswerService);


  async addPlayerToGame(gameId: string, pseudo: string, playerId: string, host_id: string|undefined) {
    return await set(ref(this.db, 'games/' + gameId + '/players/'+playerId), {pseudo : pseudo, score: 0, host: host_id!=undefined})
  }

	async updateScore(gameId: string, player: Player, number: number): Promise<void> {
    if(number > 0){
      await update(ref(this.db, 'games/' + gameId + '/players/'+player.uid), {score: number});
    }

    return await this.answerService.resetAnswerToPlayerNode(gameId, player.uid, new Map(Array.from(player.answers.keys()).map(key => [key, ""])));
	}
}
