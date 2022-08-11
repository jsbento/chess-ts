import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    promotion: null,
}

export const promotionSlice = createSlice({
    name: "promotion",
    initialState,
    reducers: {
        setPromotion: (state, action) => {
            state.promotion = action.payload;
        },
    },
});

export const { setPromotion } = promotionSlice.actions;

export default promotionSlice.reducer;