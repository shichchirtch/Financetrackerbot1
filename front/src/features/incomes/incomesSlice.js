import {createSlice, nanoid} from '@reduxjs/toolkit'

/**
 * Доход:
 * {
 *   id: string
 *   title?: string
 *   amount: number
 *   date: string
 * }
 */

const initialState = {
    dohodList: [],
}

const incomesSlice = createSlice({
    name: 'incomes',
    initialState,
    reducers: {
        /**
         * Добавление дохода
         */
        addIncome: {
            reducer(state, action) {
                state.dohodList.push(action.payload)
            },
        },
         setIncome(state, action) {
            state.dohodList = action.payload;
        },
        /**
         * Удаление дохода
         */
        removeIncome(state, action) {
            state.dohodList = state.dohodList.filter(
                (income) => income.id !== action.payload
            )
        },

        /**
         * Очистка всех доходов
         */
        clearIncomes(state) {
            state.dohodList = []
        },
    },
})

export const {
    addIncome,
    setIncome,
    removeIncome,
    clearIncomes,
} = incomesSlice.actions

export default incomesSlice.reducer
