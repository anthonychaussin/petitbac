import {createReducer, on} from '@ngrx/store';
import * as GameActions from './game.actions';

export interface GameState {
  data: any;
  loading: boolean;
  error: any;
  timer: number;
  timerRunning: boolean;
  roundId: number;
  params: any;
  status: string;
}

export const initialState: GameState = {
  data: null,
  loading: false,
  error: null,
  timer: 60,
  timerRunning: false,
  roundId: 1,
  params: null,
  status: 'waiting'
};

export const gameReducer = createReducer(
  initialState,
  on(GameActions.nextRound, state => ({
    ...state,
    roundId: state.roundId + 1,
    timer: 60,
    timerRunning: false
  })),
  on(GameActions.loadGameParams, state => ({ ...state, loading: true })),
  on(GameActions.loadGameParamsSuccess, (state, { params }) => ({
    ...state,
    params,
    loading: false
  })),
  on(GameActions.loadGameParamsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  on(GameActions.loadGameStatus, state => ({ ...state, loading: true })),
  on(GameActions.loadGameStatusSuccess, (state, { status }) => ({
    ...state,
    status,
    loading: false
  })),
  on(GameActions.loadGameStatusFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
);
