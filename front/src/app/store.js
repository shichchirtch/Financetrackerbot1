import {configureStore} from '@reduxjs/toolkit'
import expensesReducer from '../features/expenses/expensesSlice'
import incomesReducer from '../features/incomes/incomesSlice'
import userReducer from '../features/user/userSlice'

export const store = configureStore({
    reducer: {
        expensesUser: expensesReducer,
        incomesUser: incomesReducer,
        user: userReducer
    },
})


