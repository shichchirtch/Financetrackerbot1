import { useSelector } from 'react-redux'
import { useState } from 'react'
import MonthsGrid from './MonthsGrid'
import ButtonBack from '../components/common/ButtonBack'
import ReportMonthIncomes from './ReportMonthIncomes'

export default function MonthsBoardForIncomes() {
    const dohodList = useSelector(
        state => state.incomesUser.dohodList
    )

    const [activeMonth, setActiveMonth] = useState(null)

    // 1️⃣ Пока месяц не выбран — показываем сетку
    if (!activeMonth) {
        return (
            <div>
                <h2
                    className="
                        mt-8
                        text-[30px]
                        font-bold
                        text-gray-100
                        flex
                        justify-center
                    "
                >
                    2026
                </h2>

                <MonthsGrid onSelect={setActiveMonth} />

                <div className="flex justify-center">
                    <ButtonBack />
                </div>
            </div>
        )
    }

    // 2️⃣ Фильтрация доходов по месяцу
    const filtered = dohodList.filter(item =>
        item.date.startsWith(activeMonth)
    )

    return (
        <ReportMonthIncomes
            incomesForMonth={filtered}
            month={activeMonth}
            onBack={() => setActiveMonth(null)}
        />
    )
}
