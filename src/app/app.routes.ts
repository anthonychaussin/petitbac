import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomePage),
  },
  {
    path: 'create',
    loadComponent: () => import('./pages/create-game/create-game.component').then(m => m.CreateGamePage),
  },
  {
    path: 'partie/:code',
    loadComponent: () => import('./pages/join-game/join-game.component').then(m => m.JoinGamePage),
  },
  {
    path: 'salle-attente/:code',
    loadComponent: () => import('./pages/waiting-room/waiting-room.component').then(m => m.WaitingRoomPage),
  },
  {
    path: 'waiting-game/:code',
    loadComponent: () => import('./pages/waiting-game/waiting-game.component').then(m => m.WaitingGamePage),
  },
  {
    path: 'end-game/:code',
    loadComponent: () => import('./pages/end-game/end-game.component').then(m => m.EndGameComponent),
  },
  {
    path: 'validation-game/:code',
    loadComponent: () => import('./pages/validation-game/validation-game.component').then(m => m.ValidationGamePage),
  },
  {
    path: 'game/:code',
    loadComponent: () => import('./pages/game/game.component').then(m => m.GamePage),
  }
];
