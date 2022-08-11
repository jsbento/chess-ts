import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    turn: "w",
}

export const turnSlice = createSlice({
    name: "turn",
    initialState,
    reducers: {
        setTurn: (state, action) => {
            state.turn = action.payload;
        },
    },
});

export const { setTurn } = turnSlice.actions;

export default turnSlice.reducer;