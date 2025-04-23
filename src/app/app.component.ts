import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {IonApp, IonContent, IonHeader, IonTitle, IonToolbar} from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
             imports: [RouterOutlet, IonApp, IonToolbar, IonHeader, IonContent, IonTitle],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent {
  title = 'petit-bac';
}
