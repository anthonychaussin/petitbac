import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonInput,
  IonItem,
  IonLabel
} from '@ionic/angular/standalone';

@Component({
             selector: 'app-home',
             templateUrl: './home.component.html',
             styleUrls: ['./home.component.scss'],
             imports: [
               IonContent,
               IonButton,
               IonItem,
               IonLabel,
               IonInput,
               FormsModule,
               IonCard,
               IonCardHeader,
               IonCardTitle,
               IonCardContent
             ]
           })
export class HomePage {
  joinCode = '';

  constructor(private router: Router) {}

  async goToCreate() {
    return await this.router.navigate(['/create']);
  }

  async goToJoin() {
    if (this.joinCode.trim()) {
      return await this.router.navigate(['/partie', this.joinCode.trim()]);
    } else {
      return Promise.resolve();
    }
  }
}
