import { createAction, props } from '@ngrx/store';
import {Player} from '../../Models/Player';

export const loadPlayers = createAction(
  '[Player] Load Players',
  props<{ gameId: string }>()
);

export const loadPlayersSuccess = createAction(
  '[Player] Load Players Success',
  props<{ data: Player[] }>()
);

export const loadPlayersFailure = createAction(
  '[Player] Load Players Failure',
  props<{ error: any }>()
);
