import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PlayerState } from './player.reducer';

export const selectPlayerState = createFeatureSelector<PlayerState>('players');

export const selectPlayerList = createSelector(
  selectPlayerState,
  (state: PlayerState | undefined) => state ? state.data : []
);
