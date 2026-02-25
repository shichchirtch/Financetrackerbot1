import { createSlice } from '@reduxjs/toolkit'

/**
 * Каждый расход:
 * {
 *   id: string
 *   category: string
 *   title?: string
 *   amount: number
 *   date: string
 * }
 */

const rashodState = {
    trataList: [],
    total: 0// все расходы
}

const expensesSlice = createSlice({
    name: 'expenses',
    initialState: rashodState,
    reducers: {
        /**
         * Добавление расхода
         */
        addExpense(state, action) {
            state.trataList.push(action.payload);
        },

        setExpenses(state, action) {
            state.trataList = action.payload;
            state.total = action.payload.total
        },

        removeExpense(state, action) {
            state.trataList = state.trataList.filter(
                (expense) => expense.id !== action.payload
            )
        },

        setTotal(state, action) {
            state.total = action.payload
        },
    },
})

export const {
    addExpense,
    setExpenses,
    removeExpense,
    setTotal
} = expensesSlice.actions

export default expensesSlice.reducer
