// pages/BalancePage.jsx
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux"
import {Link, useParams, useNavigate} from "react-router-dom"
import {groupExpensesByCategory} from "./externalFunc"
import TelegramButton from "../components/common/TelegramButton"
import ExpensesPie from "../features/ui/PieChart"
import Modal from "../components/rashod/Modal"
import {useEffect} from "react";
import {getUserExpenses} from "../app/getUserExpenses";
import {getTelegramUser} from "../utils/tg";
import {setExpenses} from "../features/expenses/expensesSlice";


const monthDict = {
    '2026-01': 'January 2026',
    '2026-02': 'February 2026',
    '2026-03': 'March 2026',
    // дальше при необходимости
}

export default function BalancePage() {
    const {month} = useParams()
    const navigate = useNavigate()
    const [showChart, setShowChart] = useState(false)
    const [loading, setLoading] = useState(true);
    const user = getTelegramUser();

    const dispatch = useDispatch()

    useEffect(() => {

        async function loadExpenses() {
            if (!user) {
                setLoading(false);
                return;
            }


            try {

                const data = await getUserExpenses(
                    `/api/expenses/${user.id}/${month}`
                );

                dispatch(setExpenses(data.expenses));

            } catch (err) {

                console.error("Ошибка загрузки расходов", err);

            } finally {
                setLoading(false);
            }
        }


        loadExpenses();

    }, [month, dispatch, user]);

    const userId = '123'
    // 2️⃣ Фильтрация по месяцу из URL
    const filtered = useSelector(
        state => state.expensesUser.trataList)

    // 3️⃣ Пустое состояние
    function getEmptyMessage(monthKey) {
        const now = new Date().toISOString().slice(0, 7)

        const message =
            monthKey > now
                ? 'Трат в будущем ещё нет'
                : 'В этом месяце трат нет'

        const buttonText =
            monthKey === now
                ? 'Добавить расход'
                : 'Вернуться'

        const link =
            monthKey === now
                ? '/expenses'
                : '/balance'

        return {message, buttonText, link}
    }

    if (loading) {
        return <div>Loading...</div>
    }
    // ⛔ НЕТ ТРАТ
    if (filtered.length === 0) {


        const {message, buttonText, link} = getEmptyMessage(month)

        return (
            <div className="w-full max-w-[420px] mx-auto p-6 text-center text-slate-100">
                <h1 className="text-2xl font-bold mb-6">
                    Баланс расходов
                </h1>

                <p className="text-lg mb-8 opacity-80">
                    {message}
                </p>

                <Link to={link}>
                    <button className="
            w-full py-4
            bg-slate-600
            rounded-lg
            font-semibold
            active:scale-95
          ">
                        {buttonText}
                    </button>
                </Link>
            </div>
        )
    }

    // 4️⃣ Агрегация (ТОЛЬКО если есть данные)
    const grouped = groupExpensesByCategory(filtered)

    const grandTotal = filtered.reduce(
        (sum, item) => sum + item.price, 0)

    // ✅ ОСНОВНОЙ ОТЧЁТ
    return (
        <div className="w-full max-w-[420px] mx-auto p-4 text-slate-100">

            <div className="text-xl font-semibold text-center mb-2">
                {monthDict[month] ?? month}
            </div>

            <h1 className="text-xl font-semibold text-center mb-4">
                Баланс расходов
            </h1>

            {/* Категории */}
            <div className="space-y-4">
                {Object.entries(grouped).map(([category, data]) => {
                    const hasNamed = Object.keys(data.named).length > 0
                    const hasUnnamed = data.unnamedTotal > 0

                    return (
                        <div
                            key={category}
                            className="bg-slate-800 rounded-lg p-4"
                        >
                            {!hasNamed && hasUnnamed ? (
                                <div className="flex justify-between font-semibold">
                                    <span>{category}</span>
                                    <span>{data.total}</span>
                                </div>
                            ) : (
                                <>
                                    <h2 className="font-semibold mb-2">
                                        {category}
                                    </h2>

                                    {Object.entries(data.named).map(
                                        ([title, sum]) => (
                                            <div
                                                key={title}
                                                className="flex justify-between text-sm"
                                            >
                                                <span>{title}</span>
                                                <span>{sum}</span>
                                            </div>
                                        )
                                    )}

                                    {hasUnnamed && (
                                        <div className="flex justify-between text-sm italic opacity-80">
                                            <span>Без названия</span>
                                            <span>{data.unnamedTotal}</span>
                                        </div>
                                    )}

                                    <div className="
                    flex justify-between
                    font-semibold mt-2
                    border-t border-slate-600 pt-2
                  ">
                                        <span>Итого</span>
                                        <span>{data.total}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Общий итог */}
            <div className="
        mt-6 p-4
        bg-slate-700
        rounded-lg
        flex justify-between
        font-bold text-lg
      ">
                <span>Всего</span>
                <span>{grandTotal}</span>
            </div>

            {/* Кнопки */}
            <div className="grid grid-cols-2 gap-4 mt-10">
                <button
                    onClick={() => navigate('/balance')}
                    className="
            w-full py-3
            bg-slate-600
            rounded-lg
            active:scale-95
            font-bold
            text-blue-100
            border-2 border-cyan-400
          "
                >
                    Назад
                </button>

                <Link to="/">
                    <button className="
            w-full py-3
            bg-slate-500
            rounded-lg
            active:scale-95
            font-bold
            text-white
            border-2 border-cyan-400
          ">
                        На главную
                    </button>
                </Link>
            </div>
            <span className="grid grid-cols-2 gap-4">
            <div>
                <TelegramButton
                    total={grandTotal}
                    month={month}
                    user_id={userId}
                />
            </div>
            <div>
                <button className="
                w-full  py-3.5
                bg-sky-900 rounded-lg
                font-bold text-gray-300
                active:scale-95 mt-5 border-2 border-gray-500
            "

                        onClick={() => setShowChart(true)}>
                    Показать диаграмму
                </button>
            </div>
                </span>

            <div>
                {showChart && (
                    <Modal onClose={() => setShowChart(false)}>
                        <div className="max-h-[750px]">
                            <ExpensesPie grouped={grouped} itog={grandTotal}/>
                        </div>
                    </Modal>
                )}
            </div>


        </div>
    )
}


// import { useSelector } from "react-redux"
// import { Link } from "react-router-dom"
// import { groupExpensesByCategory } from "./externalFunc"
// import { useParams, useNavigate } from 'react-router-dom'
//
// const monthDict= {'2026-02':'Ferbuary 2026'}
//
// export default function BalancePage(){ //{ expensesForMonth, month }) {
//     // 1. Берём данные из Redux
//     // const trataList = useSelector((state) => state.expensesUser.trataList)
//     const { month } = useParams()
//     const navigate = useNavigate()
//     // console.log('expensesForMonth = ', expensesForMonth)
//     const trataList = useSelector(
//         state => state.expensesUser.trataList
//     )
//
//     const filtered = trataList.filter(item =>
//         item.date.startsWith(month)
//     )
//
//
//     // 2. Агрегируем (ВАЖНО: не в JSX)
//     const grouped = groupExpensesByCategory(expensesForMonth)
//
//     // 3. Общий итог
//     const grandTotal = expensesForMonth.reduce(
//         (sum, item) => sum + item.price,
//         0
//     )
//     function getEmptyMessage(monthKey) {
//         const now = new Date().toISOString().slice(0, 7)
//         console.log('NOW = ', now)
//         console.log("MonthKey = ", monthKey)
//         const sostoyanie =  monthKey > now
//             ? 'Трат в будущем ещё нет'
//             : 'В этом месяце трат нет'
//
//         const knopka =  monthKey !== now
//             ? 'Вернуться'
//             : 'Добавить расход'
//
//         const linkToPage  = monthKey !== now
//             ? '/' : '/expenses'
//
//         return [sostoyanie, knopka, linkToPage]
//     }
//
//     const [resMonthStroka, nadpisNaKnopka, linkToPage] = getEmptyMessage(month)
//
//     if (expensesForMonth.length === 0) {
//         return (
//             <div className="w-full max-w-[420px] mx-auto p-6 text-center text-slate-100">
//                 <h1 className="text-2xl font-bold mb-6">
//                     Баланс расходов
//                 </h1>
//
//                 <p className="text-lg mb-8 opacity-80">
//                     {resMonthStroka}
//                 </p>
//
//                 <Link to={linkToPage}>
//                     <button className="w-full py-4 bg-slate-600
//                     rounded-lg font-semibold active:scale-95">
//                         {nadpisNaKnopka}
//                     </button>
//                 </Link>
//             </div>
//         )
//     }
//
//
//
//     return (
//
//         <div className="w-full max-w-[420px] mx-auto p-4 text-slate-100">
//             <div className="font-semibold mb-2 text-xl text-center mb-2"
//             > {monthDict[month]} </div>
//             <h1 className="text-xl font-semibold text-center mb-4">
//                 Баланс расходов
//             </h1>
//
//             {/* Категории */}
//             <div className="space-y-4">
//                 {Object.entries(grouped).map(([category, data]) => {
//                     const hasNamed = Object.keys(data.named).length > 0
//                     const hasUnnamed = data.unnamedTotal > 0
//
//                     return (
//                         <div
//                             key={category}
//                             className="bg-slate-800 rounded-lg p-4"
//                         >
//                             {/* Случай: только безымянные */}
//                             {!hasNamed && hasUnnamed ? (
//                                 <div className="flex justify-between font-semibold">
//                                     <span>{category}</span>
//                                     <span>{data.total}</span>
//                                 </div>
//                             ) : (
//                                 <>
//                                     <h2 className="font-semibold mb-2">
//                                         {category}
//                                     </h2>
//
//                                     {/* Именные расходы */}
//                                     {Object.entries(data.named).map(
//                                         ([title, sum]) => (
//                                             <div
//                                                 key={title}
//                                                 className="flex justify-between text-sm"
//                                             >
//                                                 <span>{title}</span>
//                                                 <span>{sum}</span>
//                                             </div>
//                                         )
//                                     )}
//
//                                     {/* Безымянные */}
//                                     {hasUnnamed && (
//                                         <div className="flex justify-between text-sm italic opacity-80">
//                                             <span>Без названия</span>
//                                             <span>{data.unnamedTotal}</span>
//                                         </div>
//                                     )}
//
//                                     <div className="flex justify-between font-semibold mt-2 border-t border-slate-600 pt-2">
//                                         <span>Итого</span>
//                                         <span>{data.total}</span>
//                                     </div>
//                                 </>
//                             )}
//                         </div>
//                     )
//                 })}
//             </div>
//
//             {/* Общий итог */}
//             <div className="mt-6 p-4 bg-slate-700 rounded-lg flex justify-between font-bold text-lg">
//                 <span>Всего</span>
//                 <span>{grandTotal}</span>
//             </div>
//
//             {/* Кнопки */}
//             <div className="grid grid-cols-2 gap-4 mt-6">
//                 <Link to="/expenses">
//                     <button className="w-full py-3 bg-slate-600 rounded-lg mb-4
//                     active:scale-95 font-bold text-blue-100 border-2 border-cyan-400">
//                         Назад
//                     </button>
//                 </Link>
//
//                 <Link to="/">
//                     <button className="w-full py-3 bg-slate-500 rounded-lg active:scale-95
//                     font-bold text-white border-2 border-cyan-400">
//                         На главную
//                     </button>
//                 </Link>
//             </div>
//         </div>
//     )
// }
