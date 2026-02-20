import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import ExpensesPage from './pages/ExpensesPage'
import IncomesPage from './pages/IncomesPage'
import BalancePage from "./pages/BalancePage"
import AddIncome from "./pages/AddIncome"
import MonthsBoard from "./pages/MonthsBoard"
import MonthsBoardForIncomes from "./pages/MonthsBoardForIncomes"


const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                index: true,
                element: <HomePage />
            },
            {
                path: 'expenses',
                element: <ExpensesPage />
            },
            {
                path: 'incomes',
                element: <IncomesPage />
            },

            {
                path: 'balance',
                children: [
                    {
                        index: true,
                        element: <MonthsBoard />
                    },
                    {
                        path: ':month',
                        element: <BalancePage />
                    }
                ]
            },

            {
                path: 'incomes/add',
                element: <AddIncome />
            },
            {
                path: 'incomes/list',
                element: <MonthsBoardForIncomes />
            },
        ],
    },
])

function App() {
    return <RouterProvider router={router} />
}

export default App

