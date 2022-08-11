import { configureStore } from '@reduxjs/toolkit';
import boardReducer from './slices/Board';
import gameStatusReducer from './slices/GameStatus';
import promotionReducer from './slices/Promotion';
import turnReducer from './slices/Turn';
import resultReducer from './slices/Result';

export const store = configureStore({
    reducer: {
        board: boardReducer,
        gameStatus: gameStatusReducer,
        promotion: promotionReducer,
        turn: turnReducer,
        result: resultReducer,
    },
});