import {useDispatch} from 'react-redux'
import {addExpense} from '../../features/expenses/expensesSlice'
import {useState} from 'react'
// import {addIncome} from "../../features/incomes/incomesSlice.js";


export default function Modal({onClose, children}) {
    return (
        <div
            className="
        fixed inset-0 bg-black/60 flex  items-center justify-center
        z-50 text-rose-700"
        >
            <div
                className="w-[90%] max-w-[360px] bg-zinc-700
          rounded-xl p-5
          text-white
          shadow-xl border-2 border-cyan-700">
                <div>
                    <div className="mb-4 text-white">
                        {children}
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-zinc-600 py-2 rounded-lg text-sm
                            border-2 border-gray-300">
                            Закрыть
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}