import {createSlice} from '@reduxjs/toolkit'

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
    total: 0
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
            state.dohodList = action.payload.incomes;
            state.total = action.payload.total
        },
        /**
         * Удаление дохода
         */
        removeIncome(state, action) {
            state.dohodList = state.dohodList.filter(
                (income) => income.id !== action.payload
            )
        },

        setTotal(state, action) {
            state.total = action.payload
        },
    },
})

export const {
    addIncome,
    setIncome,
    removeIncome,
    setTotal,
} = incomesSlice.actions

export default incomesSlice.reducer
