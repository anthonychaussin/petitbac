import {inject, Injectable} from '@angular/core';
import {Database, ref, update} from '@angular/fire/database';
import {addDoc, collection, doc, Firestore, getDoc} from '@angular/fire/firestore';
import {PlayerService} from './player.service';

@Injectable({providedIn: 'root'})
export class GameService {

  private firestore: Firestore = inject(Firestore);
  private db: Database = inject(Database);
  private playerService: PlayerService = inject(PlayerService);

  async createGame(theme: string, categories: string[], allowedLetters: string[], turns: number, timer: number, hostId: string): Promise<string> {
    const game = {
      theme,
      categories,
      hostId,
      allowedLetters,
      turns,
      timer,
      createdAt: new Date()
    };
    const docRef = await addDoc(collection(this.firestore, 'parties'), game);
    this.playerService.addPlayerToGame(docRef.id, '', hostId, hostId);
    return docRef.id;
  }

  async startGame(gameId: string, actuelTurn: any, timer: number) {
    return await this.nextTurn(gameId, 0, actuelTurn, timer);
  }

  async restartGame(gameId: string) {
    return await update(ref(this.db), {
      [`games/${gameId}/status`]: 'waiting',
    });
  }

  async startTimer(gameId: string, timeLeft: number) {
    const interval = setInterval(async () => {
      timeLeft--;
      if (timeLeft >= 0) {
        await update( ref(this.db, `games/${gameId}/current`), {timer: timeLeft});
      } else {
        clearInterval(interval);
        await update( ref(this.db, `games/${gameId}`), {status: 'validation'});
      }
    }, 1000);
  }

  async nextTurn(gameId: string, id: number, turn: any, timer: number): Promise<void> {
    const letters: string[] = (await getDoc(doc(this.firestore, 'parties', gameId))).data()?.['allowedLetters'] || [];
    let letter = turn.letter;
    while (letter === turn.letter){
      letter = letters[Math.floor(Math.random() * letters.length)]
    }
    update(ref(this.db, `games/${gameId}`), {
      current: {
        letter,
        id,
        timer
      },
      status: 'started'
    }).then(() => this.startTimer(gameId, timer));
  }

  async endGame(gameId: string): Promise<void> {
    return await update(ref(this.db), {
      [`games/${gameId}/status`]: 'terminated',
      [`games/${gameId}/current`]: null
    });
  }
}
