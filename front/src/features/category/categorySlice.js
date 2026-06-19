import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    spisokKategories: []
};

const categorySlice = createSlice({

    name: "categories",

    initialState,

    reducers: {

        setCategories(state, action) {
            state.spisokKategories = action.payload;
        },

        addCategory(state, action) {
            state.spisokKategories.push(action.payload);
        },

        removeCategory(state, action) {
            state.spisokKategories = state.spisokKategories.filter(
                category => category !== action.payload
            );
        },

        clearCategories(state) {
            state.spisokKategories = [];
        }

    }

});

export const {
    setCategories,
    addCategory,
    removeCategory,
    clearCategories
} = categorySlice.actions;

export default categorySlice.reducer;