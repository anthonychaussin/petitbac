import {Answer} from './Answer';

export class Player {
  uid: string = window.crypto.randomUUID();
  pseudo: string = '';
  host: boolean = false;
  score: number = 0;
  done: boolean = false;
  answers: Map<string, Answer> = new Map<string, Answer>();

  constructor(uuid: string, data: any) {
    this.uid = uuid;
    this.host = data['host'];
    this.score = data['score'];
    this.done = data['done'];
    this.pseudo = data['pseudo'];
    if(data['answers']) {
      Object.entries(data['answers']).forEach((answer: any) => {
        this.answers.set(answer[0], new Answer(answer[1]));
      });
    }
  }

  getAnswer(cat: string): string {
    try{
      if(this.answers.has(cat)) {
        return this.answers.get(cat)?.text + '';
      } else {
        return '-';
      }
    }catch (error){
      return '-';
    }
  }
}
