import { createReducer, on } from '@ngrx/store';
import * as TurnActions from './turn.actions';

export interface TurnState {
  data: any;
  loading: boolean;
  error: any;
}

export const initialTurnState: TurnState = {
  data: null,
  loading: false,
  error: null,
};

export const turnReducer = createReducer(
  initialTurnState,
  on(TurnActions.loadTurn, state => ({ ...state, loading: true })),
  on(TurnActions.loadTurnSuccess, (state, { data }) => ({ ...state, data, loading: false })),
  on(TurnActions.loadTurnFailure, (state, { error }) => ({ ...state, error, loading: false }))
);
