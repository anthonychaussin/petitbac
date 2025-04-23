import {inject, Injectable} from '@angular/core';
import {FirebaseApp} from '@angular/fire/app';
import {Database, getDatabase, increment, ref, update} from '@angular/fire/database';
import {addDoc, collection, doc, Firestore, getDoc} from '@angular/fire/firestore';
import {PlayerService} from './player.service';

@Injectable({providedIn: 'root'})
export class GameService {

  firestore: Firestore = inject(Firestore);
  private db: Database = getDatabase(inject(FirebaseApp));
  playerService: PlayerService = inject(PlayerService);

  async createGame(theme: string, categories: string[], allowedLetters: string[], turns: number, hostId: string): Promise<string> {
    const game = {
      theme,
      categories,
      hostId,
      allowedLetters,
      turns,
      createdAt: new Date()
    };
    const docRef = await addDoc(collection(this.firestore, 'parties'), game);
    this.playerService.addPlayerToGame(docRef.id, '', hostId, hostId);
    return docRef.id;
  }

  async startGame(gameId: string, actuelTurn: any) {
    return await this.nextTurn(gameId, 0, actuelTurn);
  }

  async restartGame(gameId: string) {
    return await update(ref(this.db), {
      [`games/${gameId}/status`]: 'waiting',
    });
  }


  async startTimer(gameId: string) {
    let timeLeft = 60;
    const interval = setInterval(async () => {
      timeLeft--;
      if (timeLeft >= 0) {
        await update( ref(this.db, `games/${gameId}/current`), {timer: timeLeft});
      } else {
        clearInterval(interval);
      }
    }, 1000);
  }

  async nextTurn(gameId: string, id: number, turn: any): Promise<void> {
    const letters: string[] = (await getDoc(doc(this.firestore, 'parties', gameId))).data()?.['allowedLetters'] || [];
    let letter = turn.letter;
    while (letter === turn.letter){
      letter = letters[Math.floor(Math.random() * letters.length)]
    }
    update(ref(this.db, `games/${gameId}`), {
      current: {
        letter,
        id,
        timer: 60
      }
    }).then(() => this.startTimer(gameId));
  }

  async endGame(gameId: string): Promise<void> {
    return await update(ref(this.db), {
      [`games/${gameId}/status`]: 'terminated',
      [`games/${gameId}/current`]: null
    });
  }
}
