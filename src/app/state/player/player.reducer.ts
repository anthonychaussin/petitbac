import { createReducer, on } from '@ngrx/store';
import {Player} from '../../Models/Player';
import * as PlayerActions from './player.actions';

export interface PlayerState {
  data: Player[];
  loading: boolean;
  error: any;
}

export const initialPlayerState: PlayerState = {
  data: [],
  loading: false,
  error: null,
};

export const playerReducer = createReducer(
  initialPlayerState,
  on(PlayerActions.loadPlayers, state => ({ ...state, loading: true })),
  on(PlayerActions.loadPlayersSuccess, (state, { data }) => ({ ...state, data, loading: false })),
  on(PlayerActions.loadPlayersFailure, (state, { error }) => ({ ...state, error, loading: false }))
);
