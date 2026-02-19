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
import { useTranslation } from "../features/customHoock";


const future_expenses_dict = {
    'ru':'Трат в будущем ещё нет',
    'de':'Bisher sind keine weiteren Ausgaben geplant.',
    'uk':'Витрат у майбутньому ще немає',
    'tr':'Henüz geleceğe yönelik bir masraf yok.'
}

const now_expenses_dict = {
    'ru':'В этом месяце трат нет',
    'de':'Diesen Monat fallen keine Ausgaben an.',
    'uk':'Цього місяця витрат немає',
    'tr':'Bu ay herhangi bir masraf yok.'
}


const add_expence_dict = {
    'ru':'Добавить расход',
    'de':'Verbrauch hinzufügen',
    'uk':'Додати витрату',
    'tr':'Gider ekle'
}


const back_dict = {
    'ru':'Вернуться',
    'de':'Zurückkehren',
    'uk':'Повернутись',
    'tr':'Geri dönmek'
}


const monthDict = {
    '2026-01': 'January 2026',
    '2026-02': 'February 2026',
    '2026-03': 'March 2026',
    '2026-04': 'April 2026',
    '2026-05': 'Mai 2026',
    '2026-06': 'June 2026',
    '2026-07': 'July 2026',
    '2026-08': 'August 2026',
    '2026-09': 'September 2026',
    '2026-10': 'October 2026',
    '2026-11': 'November 2026',
    '2026-12': 'December 2026'}

export default function BalancePage() {
    const {month} = useParams()
    const navigate = useNavigate()
    const [showChart, setShowChart] = useState(false)
    const [loading, setLoading] = useState(true);
    const user = useSelector(state => state.user.user)

    const dispatch = useDispatch()


    useEffect(() => {

        async function loadExpenses() {
            if (!user) {
                console.log("No USER")
                setLoading(false);
                return;
            }
            try {
                console.log('USER_ID = ', user.id)
                const data = await getUserExpenses(
                    `/api/expenses/${user.id}/${month}`
                );

                dispatch(setExpenses(data.expenses));

            } catch (err) {

                console.error("Error loading expenses", err);

            } finally {
                setLoading(false);
            }
        }

        loadExpenses();

    }, [month, dispatch, user]);
///////////////////////////////////////////////////////////////////////////////////
    const userId = user?.id
    // 2️⃣ Фильтрация по месяцу из URL
    const filtered = useSelector(
        state => state.expensesUser.trataList)

    const lan = useSelector(
        state => state.user.lan
    )

    const { t } = useTranslation()

    // 3️⃣ Пустое состояние
    function getEmptyMessage(monthKey) {
        const now = new Date().toISOString().slice(0, 7)

        const message =
            monthKey > now
                ? future_expenses_dict[lan]
                : now_expenses_dict[lan]

        const buttonText =
            monthKey === now
                ? add_expence_dict[lan]
                : back_dict[lan]

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
                    {t('BudgetExpenses')}
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
                {t('BalanceOfExpenses')}
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
                                            <span>{t('NoName')}</span>
                                            <span>{data.unnamedTotal}</span>
                                        </div>
                                    )}

                                    <div className="
                    flex justify-between
                    font-semibold mt-2
                    border-t border-slate-600 pt-2
                  ">
                                        <span>{t("Total")}</span>
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
                <span>{t('Sum')}</span>
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
                    {t("Back")}
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
                        {t('HomePage')}
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
                    {t('ShowGraphic')}
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

