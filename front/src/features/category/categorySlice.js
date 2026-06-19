import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    spisokKategories: []
};

const categorySlice = createSlice({

    name: "categories",

    initialState,

    reducers: {

        setCategories(state, action) {
            state.list = action.payload;
        },

        addCategory(state, action) {
            state.list.push(action.payload);
        },

        removeCategory(state, action) {
            state.list = state.list.filter(
                category => category !== action.payload
            );
        },

        clearCategories(state) {
            state.list = [];
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