import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    result: null,
}

export const resultSlice = createSlice({
    name: "result",
    initialState,
    reducers: {
        setResult: (state, action) => {
            state.result = action.payload;
        },
    },
});

export const { setResult } = resultSlice.actions;

export default resultSlice.reducer;