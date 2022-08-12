import { applyMiddleware, configureStore, Store } from '@reduxjs/toolkit';
import { GameState } from '../types/chess/GameState';
import { Action } from './actions/ActionTypes';
import chessReducer from './reducers/Reducers';

export const store: Store<GameState, Action> & {
    dispatch: (action: Action) => Action;
} = configureStore({
    reducer: chessReducer,
});