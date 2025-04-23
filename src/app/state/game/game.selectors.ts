import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GameState } from './game.reducer';

export const selectGameState = createFeatureSelector<GameState>('game');

export const selectGameParams = createSelector(
  selectGameState,
  (state: GameState | undefined) => state ? state.params : null
);
export const selectGameStatus = createSelector(
  selectGameState,
  (state: GameState | undefined) => state ? state.status : null
);

export const selectTimer = createSelector(
  selectGameState,
  state => state.timer
);

export const selectTimerRunning = createSelector(
  selectGameState,
  state => state.timerRunning
);

export const selectRoundId = createSelector(
  selectGameState,
  state => state.roundId
);
