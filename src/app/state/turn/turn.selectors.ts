import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TurnState } from './turn.reducer';

export const selectTurnState = createFeatureSelector<TurnState>('turn');

export const selectTurnData = createSelector(
  selectTurnState,
  (state: TurnState | undefined) => state ? state.data : null
);
