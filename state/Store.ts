import { configureStore, Store } from '@reduxjs/toolkit';
import { GameState } from '../types/chess/GameState';
import { Action } from '../types/chess/GameState';
import chessReducer from './reducers/Reducers';

export const store: Store<GameState, Action> & {
    dispatch: (action: Action) => Action;
} = configureStore({
    reducer: chessReducer,
});