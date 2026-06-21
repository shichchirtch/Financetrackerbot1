import {configureStore} from '@reduxjs/toolkit'
import expensesReducer from '../features/expenses/expensesSlice'
import incomesReducer from '../features/incomes/incomesSlice'
import userReducer from '../features/user/userSlice'
import categoryReducer from "../features/category/categorySlice.js"
import currencyReducer from "../features/currency/currencySlice.js"

export const store = configureStore({
    reducer: {
        expensesUser: expensesReducer,
        incomesUser: incomesReducer,
        user: userReducer,
        category:categoryReducer,
        currency: currencyReducer
    }
})


