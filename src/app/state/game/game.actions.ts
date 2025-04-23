import { createAction, props } from '@ngrx/store';

export const nextRound = createAction('[Game] Next Round');
export const loadGameParams = createAction('[Game] Load Game Params', props<{ gameId: string }>());
export const loadGameParamsSuccess = createAction('[Game] Load Game Params Success', props<{ params: any }>());
export const loadGameParamsFailure = createAction('[Game] Load Game Params Failure', props<{ error: any }>());
export const loadGameStatus = createAction('[Game] Load Game Status', props<{ gameId: string }>());
export const loadGameStatusSuccess = createAction('[Game] Load Game Status Success', props<{ status: any }>());
export const loadGameStatusFailure = createAction('[Game] Load Game Status Failure', props<{ error: any }>());
