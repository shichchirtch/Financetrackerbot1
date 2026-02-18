import ButtonBack from '../components/common/ButtonBack'
import { useSelector } from "react-redux";
import { useTranslation } from "../features/customHoock";

const future_incomes_dict = {
    'ru':'Доходов в будущем ещё нет',
    'de':'Es gibt noch keine zukünftigen Einnahmen',
    'uk':'Доходів у майбутньому ще немає',
    'tr':'Gelecekte henüz bir gelir yok'
}

const now_incomes_dict = {
    'ru':'В этом месяце доходов нет',
    'de':'Diesen Monat gibt es kein Einkommen',
    'uk':'Цього місяця доходів немає',
    'tr':'Bu ay hiç gelir yok'
}


export default function ReportMonthIncomes({ incomes, total, month }) {
    const lan = useSelector(
        state => state.user.lan)

    const t = useTranslation()

    function formatDay(dateString) {
        const date = new Date(dateString)

        const day = date.getDate().toString().padStart(2, '0')
        const monthNum = (date.getMonth() + 1).toString().padStart(2, '0')

        return `${day}.${monthNum}`
    }

    function getDohodMessage(monthKey) {
        const now = new Date().toISOString().slice(0, 7)

        return monthKey > now
            ? future_incomes_dict[lan]
            : now_incomes_dict[lan]
    }

    if (!incomes || incomes.length === 0) {
        return (
            <div className="w-full max-w-[430px] p-4 items-center gap-4 flex flex-col mt-64">
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
                        font-bold"
                >
                    {getDohodMessage(month)}
                </div>
                <ButtonBack/>
            </div>
        )
    }

    return (
        <div className="grid w-full max-w-[420px] mx-auto p-4">
            <div className="bg-slate-800 rounded-lg p-4 text-white">

                <h2 className="font-semibold mb-4 text-xl text-center">
                    {month}
                </h2>

                {incomes.map((income) => (
                    <div key={income.id} className="flex justify-between text-lg">
                        <span>
                            {income.title
                                ? `${formatDay(income.createdAt)} — ${income.title}`
                                : formatDay(income.createdAt)
                            }
                        </span>
                        <span>{income.amount}</span>
                    </div>
                ))}

                <div className="mt-6 p-4 bg-slate-700 rounded-lg flex justify-between font-bold text-lg">
                    <span>{t('Sum')}</span>
                    <span>{total}</span>
                </div>

            </div>

            <div className="flex items-center justify-center mt-4">
                <ButtonBack/>
            </div>
        </div>
    )
}


