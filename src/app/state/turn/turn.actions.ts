import { createAction, props } from '@ngrx/store';

export const loadTurn = createAction(
  '[Turn] Load Turn',
  props<{ gameId: string }>()
);

export const loadTurnSuccess = createAction(
  '[Turn] Load Turn Success',
  props<{ data: any }>()
);

export const loadTurnFailure = createAction(
  '[Turn] Load Turn Failure',
  props<{ error: any }>()
);
