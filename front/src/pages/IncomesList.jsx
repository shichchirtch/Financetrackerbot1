import {useSelector} from "react-redux"
import {useState} from "react"
import {groupIncomesByMonth, buildMonthReport} from "../utils/incomesCount"
import ButtonBack from '../components/common/ButtonBack'


export default function IncomesList() {
    const dohodList = useSelector(state => state.incomesUser.dohodList)

    const grouped = groupIncomesByMonth(dohodList)

    console.log('grouped = ', grouped)

    const monthKeys = Object.keys(grouped).sort().reverse()

    console.log('MONTHKEYS = ', monthKeys)

    const [activeMonth, setActiveMonth] = useState(monthKeys[0])

    function formatDay(dateString) {
        const date = new Date(dateString)

        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')

        return `${day}.${month}`
    }

    if (!activeMonth) {
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
            font-bold
          "
                >
                    Доходов нет
                </div>
                <ButtonBack/>
            </div>
        )
    }

    const report = buildMonthReport(grouped[activeMonth].items)

    return (
        <div className='grid w-full max-w-[420px] mx-auto max-h-1 p-4 justify-self-center'>
            <div className="bg-slate-800
         rounded-lg p-4 text-white ">

                <h2 className="font-semibold mb-2">
                    Январь 2026
                </h2>

                {report.items.map((income, index) => (
                    <div key={index} className="flex justify-between text-sm">
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

