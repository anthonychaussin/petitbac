import {inject, Injectable} from '@angular/core';
import {Database, ref, update} from '@angular/fire/database';

@Injectable({ providedIn: 'root' })
export class AnswerService {
  private db: Database = inject(Database);

  async submitAnswersToPlayerNode(gameId: string, uid: string, answers: Record<string, string>) {
    await update(ref(this.db, `games/${gameId}/players/${uid}`), {answers: answers, done: true});
  }
  async resetAnswerToPlayerNode(gameId: string, uid: string, answers: Map<string, string>) {
    await update(ref(this.db, `games/${gameId}/players/${uid}`), {answers: answers, done: false});
  }
}
