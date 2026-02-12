import {createSlice, nanoid} from '@reduxjs/toolkit'

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
    trataList: [],   // все расходы
}

const expensesSlice = createSlice({
    name: 'expenses',
    initialState: rashodState,
    reducers: {
        /**
         * Добавление расхода
         */
        addExpense: {
            reducer(rashodState, action) {
                console.log('rashod_state = ', rashodState)
                rashodState.trataList.push(action.payload)
            },
            prepare({category, title, price, date}) {
                return {
                    payload: {
                        id: nanoid(),
                        category,
                        title,
                        price: Number(price),
                        date: date || new Date().toISOString(),
                    },
                }
            },
        },

        setExpenses(state, action) {
            state.trataList = action.payload;
        },


        /**
         * Удаление расхода по id
         */
        removeExpense(rashodState, action) {
            rashodState.trataList = rashodState.trataList.filter(
                (expense) => expense.id !== action.payload
            )
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
    clearExpenses
} = expensesSlice.actions

export default expensesSlice.reducer
