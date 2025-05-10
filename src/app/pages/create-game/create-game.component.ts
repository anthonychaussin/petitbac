import {Component, inject} from '@angular/core';
import { Router } from '@angular/router';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {
  IonButton, IonCard, IonCardContent, IonCardHeader,
  IonCheckbox,
  IonContent,
  IonGrid,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList, IonRange,
  IonRow
} from '@ionic/angular/standalone';
import {addIcons} from 'ionicons';
import {closeOutline} from 'ionicons/icons';
import { GameService } from '../../services/game.service';

@Component({
             selector: 'app-create-game',
             templateUrl: './create-game.component.html',
             imports: [
               IonContent,
               ReactiveFormsModule,
               IonItem,
               IonLabel,
               IonInput,
               IonList,
               IonButton,
               IonIcon,
               IonGrid,
               IonRow,
               IonCheckbox,
               IonRange,
               IonCard,
               IonCardHeader,
               IonCardContent
             ]
           })
export class CreateGamePage {

  allLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  defaultLetter = 'ABCDEFGHIJKLMNOPQRSTUV'.split('');
  private formBuilder = inject(FormBuilder);
  form: FormGroup =  this.formBuilder.group({
                                              theme: ['', Validators.required],
                                              categories: this.formBuilder.array([]),
                                              allowedLetters: this.formBuilder.array([]),
                                              turns: [5, Validators.required],
                                              timer: [60, Validators.required],
                                            });


  constructor(
    private gameService: GameService,
    private router: Router
  ) {
    addIcons({ closeOutline });
    for (let i = 0; i < 3; i++) {
      this.addCategory();
    }
    this.allLetters.forEach(letter => {
      this.addLetter(letter);
    })
  }

  get categories() {
    return this.form.get('categories') as FormArray;
  }
  get allowedLetters() {
    return this.form.get('allowedLetters') as FormArray;
  }

  addCategory() {
    this.categories.push(this.formBuilder.group({cat: ['', Validators.required]}));
  }

  removeCategory(index: number) {
    this.categories.removeAt(index);
  }

  createGame() {
    if (this.form.valid) {
      const { theme, categories, allowedLetters, turns, timer } = this.form.value;
      try{
        const uid = crypto.randomUUID();
        localStorage.setItem('uid', uid);
        this.gameService.createGame(
          theme,
          categories.map((cat: { cat: string; }) => Object.values(cat)[0]),
          allowedLetters.filter((letter: { [s: string]: unknown; } | ArrayLike<unknown>) => Object.values(letter)[0])
                        .map((letter: {}) => Object.keys(letter)[0]),
          turns,
          timer,
          uid
        ).then(code => {
          this.router.navigate(['/salle-attente', code]).then();
        });
      }catch (e) {
        console.log(e);
      }
    } else {
      console.error("form invalide");
    }
  }

  private addLetter(letter: string): void {
    this.allowedLetters.push(this.formBuilder.group({[letter]: [this.defaultLetter.some(l => l == letter)]}));
  }
}
