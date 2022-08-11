import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    gameStatus: false,
}

export const gameStatusSlice = createSlice({
    name: "gameStatus",
    initialState,
    reducers: {
        setGameStatus: (state, action) => {
            state.gameStatus = action.payload;
        },
    },
});

export const { setGameStatus } = gameStatusSlice.actions;

export default gameStatusSlice.reducer;