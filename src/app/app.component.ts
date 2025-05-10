import {NgOptimizedImage} from '@angular/common';
import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {IonApp, IonAvatar, IonContent, IonHeader, IonRow, IonTitle, IonToolbar} from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
             imports: [RouterOutlet, IonApp, IonToolbar, IonHeader, IonContent, IonTitle, IonAvatar, IonRow, NgOptimizedImage],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'Petit Bac';
}
