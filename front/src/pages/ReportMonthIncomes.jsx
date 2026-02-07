import {useSelector} from "react-redux"
import { useState} from "react"
import {groupIncomesByMonth, buildMonthReport} from "../utils/incomesCount"
import ButtonBack from '../components/common/ButtonBack'

const monthDict= {'2026-02':'Ferbuary 2026'}


export default function IncomesList({ incomesForMonth, month}) {

    const grouped = groupIncomesByMonth(incomesForMonth)

    console.log('grouped = ', grouped)

    function formatDay(dateString) {
        const date = new Date(dateString)

        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')

        return `${day}.${month}`
    }

    function getDohodMessage(monthKey) {
        const now = new Date().toISOString().slice(0, 7)

        const sostoyanie =  monthKey > now
            ? 'Доходов в будущем ещё нет'
            : 'В этом месяце доходов нет'

        return sostoyanie
    }

    const resMonthStroka = getDohodMessage(month)

    if (!incomesForMonth || incomesForMonth.length === 0) {
        return (<div className='w-full max-w-[430px] p-4 items-center gap-4 flex flex-col
           mt-64'>
                <div
                    className="
          w-[90%]
          max-w-[360px]
            bg-gradient-to-br
          from-sky-900
          to-gray-950
          rounded-xl
          p-5
          text-gray-300
          text-center
          h-28
          flex
            items-center
            justify-center
            text-xl
            border-2
            border-cyan-700
            font-bold">
                    {resMonthStroka}
                </div>
                <ButtonBack/>
            </div>
        )
    }

    const report = buildMonthReport(incomesForMonth)
// grid w-full max-w-[420px] mx-auto max-h-1 p-4 justify-self-center
    return (
        <div className='grid w-full max-w-[420px] mx-auto
        max-h-1 p-4 justify-self-center'>
            <div className="bg-slate-800
         rounded-lg p-4 text-white">

                <h2 className="font-semibold mb-4 text-xl text-center">
                    {monthDict[month]}
                </h2>

                {report.items.map((income) => (
                    <div key={income.id} className="flex justify-between text-l">
                    <span>
                        {income.title
                            ? `${formatDay(income.date)} — ${income.title}`
                            : formatDay(income.date)
                        }
                    </span>
                        <span>{income.amount}</span>
                    </div>
                ))}

                <div className="mt-6 p-4 bg-slate-700 rounded-lg flex justify-between font-bold text-lg">
                    <span>Всего</span>
                    <span>{report.total}</span>
                </div>


            </div>
            <div className='flex items-center justify-center'>
                <ButtonBack/>
            </div>

        </div>
    )
}
