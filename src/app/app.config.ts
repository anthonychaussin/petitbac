import {ApplicationConfig, provideZoneChangeDetection, isDevMode} from '@angular/core';
import {getApp, initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {initializeAppCheck, provideAppCheck, ReCaptchaEnterpriseProvider} from '@angular/fire/app-check';
import {getDatabase, provideDatabase} from '@angular/fire/database';
import {getFirestore, provideFirestore} from '@angular/fire/firestore';
import {provideRouter} from '@angular/router';
import {environment} from '../environments/environment';

import {routes} from './app.routes';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import {AnswerEffects} from './state/answer/answer.effects';
import {answerReducer} from './state/answer/answer.reducer';
import {GameEffects} from './state/game/game.effects';
import {gameReducer} from './state/game/game.reducer';
import {PlayerEffects} from './state/player/player.effects';
import {playerReducer} from './state/player/player.reducer';
import {TurnEffects} from './state/turn/turn.effects';
import {turnReducer} from './state/turn/turn.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAppCheck(() => initializeAppCheck(getApp(), {
        provider: new ReCaptchaEnterpriseProvider(environment.catpcha),
        isTokenAutoRefreshEnabled: true
    })),
    provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore()),
    provideIonicAngular({}),
    provideStore({
                   answers: answerReducer,
                   game: gameReducer,
                   players: playerReducer,
                   turn: turnReducer,
                   }),
    provideEffects([AnswerEffects, GameEffects, PlayerEffects, TurnEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
]
};
