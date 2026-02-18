import {createSlice} from '@reduxjs/toolkit'

/**
 * Каждый расход:
 * {
 *   id: string
 *   category: string
 *   title?: string
 *   amount: number
 *   createdAt: string
 * }
 */

const rashodState = {
    trataList: [],   // все расходы
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
        },

        /**
         * Очистка всех расходов (можно для тестов)
         */
        clearExpenses(rashodState) {
            rashodState.trataList = []
        },
    },
})

export const {
    addExpense,
    clearExpenses,
    setExpenses
} = expensesSlice.actions

export default expensesSlice.reducer
