import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    currency: "EUR"
};

const currencySlice = createSlice({
    name: "currency",
    initialState,
    reducers: {

        setCurrency(state, action) {
            state.currency = action.payload;
        },

        clearCurrency(state) {
            state.currency = "EUR";
        }

    }

});

export const {
    setCurrency,
    clearCurrency
} = currencySlice.actions;

export default currencySlice.reducer;