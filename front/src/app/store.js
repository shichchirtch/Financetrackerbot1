import { configureStore } from '@reduxjs/toolkit'
import expensesReducer from '../features/expenses/expensesSlice'
import incomesReducer from '../features/incomes/incomesSlice'

export const store = configureStore({
    reducer: {
        expensesUser: expensesReducer,
        incomesUser: incomesReducer,
    },
})


