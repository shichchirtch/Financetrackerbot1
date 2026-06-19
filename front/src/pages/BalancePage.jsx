// pages/BalancePage.jsx
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux"
import {Link, useParams, useNavigate} from "react-router-dom"
import {groupExpensesByCategory} from "./externalFunc"
import SendReportButton from "../components/common/TelegramButton"
import ExpensesPie from "../features/ui/PieChart"
import Modal from "../components/rashod/Modal"
import {useEffect} from "react";
import {getUserExpenses} from "../app/getUserExpenses";
import {setExpenses, setTotal, removeExpense} from "../features/expenses/expensesSlice";
import {useTranslation} from "../features/customHoock";
import {formPost} from "../app/formPost.js";
import {useMemo} from "react";

const categories_ru = [
    'Продукты',
    'Аренда',
    'Транспорт',
    'Связь и Интернет',
    'Бизнес',
    'Работа',
    'Подарки',
    'Развлечения',
    'Налоги',
    'Путешествия',
    'Лекарства',
    'Одежда / Косметика',
    'Для дома',
    'Благотворительность',
    'Учёба',
    'Хобби',
    'Спорт',
    'Иное',
]
const categories_tr = ['Market',
    'Kira',
    'Ulaşım',
    'İletişim ve İnternet',
    'Hediyeler',
    'Eğlence',
    'Vergiler',
    'Seyahat',
    'İlaçlar',
    'Giyim/Kozmetik',
    'Ev',
    'Hayır Kurumu',
    'Eğitim',
    'Hobiler',
    'Spor',
    'Diğer']

const categories_de = ['Lebensmittel',
    'Miete',
    'Transport',
    'Kommunikation und Internet',
    'Geschenke',
    'Unterhaltung',
    'Steuern',
    'Reisen',
    'Medikamente',
    'Kleidung/Kosmetik',
    'Wohnen',
    'Wohltätigkeit',
    'Studium',
    'Hobbys',
    'Sport',
    'Sonstiges']
const categories_uk = ['Продукти',
    'Оренда',
    'Транспорт',
    'Звязок та Інтернет',
    'Подарунки',
    'Розваги',
    'Податки',
    'Подорожі',
    'Ліки',
    'Одяг / Косметика',
    'Для дому',
    'Благодійність',
    'Навчання',
    'Хоббі',
    'Спорт',
    'Інше',]

const categories_dict = {
    'ru': categories_ru,
    'uk': categories_uk,
    'de': categories_de,
    'tr': categories_tr
}

const future_expenses_dict = {
    'ru': 'Трат в будущем ещё нет',
    'de': 'Bisher sind keine weiteren Ausgaben geplant.',
    'uk': 'Витрат у майбутньому ще немає',
    'tr': 'Henüz geleceğe yönelik bir masraf yok.'
}

const now_expenses_dict = {
    'ru': 'В этом месяце трат нет',
    'de': 'Diesen Monat fallen keine Ausgaben an.',
    'uk': 'Цього місяця витрат немає',
    'tr': 'Bu ay herhangi bir masraf yok.'
}


const add_expence_dict = {
    'ru': 'Добавить расход',
    'de': 'Verbrauch hinzufügen',
    'uk': 'Додати витрату',
    'tr': 'Gider ekle'
}


const back_dict = {
    'ru': 'Вернуться',
    'de': 'Zurückkehren',
    'uk': 'Повернутись',
    'tr': 'Geri dönmek'
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
    '2026-12': 'December 2026'
}

export default function BalancePage() {
    const {month} = useParams()
    const navigate = useNavigate()
    const [showChart, setShowChart] = useState(false)
    const [loading, setLoading] = useState(true);
    const user_id = useSelector(state => state.user.account?.user_id)
    const {t} = useTranslation()

    const [expenseToDelete, setExpenseToDelete] = useState(null)
    const [deleting, setDeleting] = useState(false)
    const [removingId, setRemovingId] = useState(null)
    const total = useSelector(state => state.expensesUser.total)
    const lan = useSelector(state => state.user.lan)
    const categories = useSelector(state => state.category.spisokKategories);

    const filtered = useSelector(state => state.expensesUser.trataList)

    const categoryMap = useMemo(() => {

        return new Map(
            categories.map((cat, index) => [cat, index])
        );

    }, [categories]);
    const grouped = useMemo(
        () => groupExpensesByCategory(filtered),
        [filtered]
    );

    const orderedGroups = useMemo(() => {

        return Object.entries(grouped).sort(([a], [b]) => {

            const ia = categoryMap.get(a) ?? 999;
            const ib = categoryMap.get(b) ?? 999;

            return ia - ib;

        });

    }, [grouped, categoryMap]);


    //
    // const orderedGroups = useMemo(() => {
    //
    //     return Object.entries(grouped).sort(([a], [b]) => {
    //
    //         const ia = categories.indexOf(a);
    //         const ib = categories.indexOf(b);
    //
    //         return (ia === -1 ? 999 : ia)
    //             - (ib === -1 ? 999 : ib);
    //
    //     });
    //
    // }, [grouped, categories]);


    console.log('total 176 = ', total)
    console.log('grouped = ', grouped)
    console.log('total =', total)
    console.log('typeof total =', typeof total)
    const dispatch = useDispatch()

    async function handleDeleteExpense() { // изменено: добавлен обработчик удаления дохода

        if (!expenseToDelete || !user_id) return

        try {
            setDeleting(true)

            // запускаем анимацию
            setRemovingId(expenseToDelete)

            // ждём 500мс (время анимации)
            await new Promise(resolve => setTimeout(resolve, 500))

            const data = await formPost(
                '/api/expenses/delete',
                {
                    user_id,
                    expense_id: expenseToDelete,
                    month
                }
            )

            // 1️⃣ Удаляем расход из списка
            dispatch(removeExpense(expenseToDelete))

            // 2️⃣ Обновляем total из backend
            dispatch(setTotal(data.total))

        } catch (error) {
            console.error('Ошибка удаления дохода:', error)
        } finally {
            setDeleting(false)
            setExpenseToDelete(null)
            setRemovingId(null)
        }
    }


    useEffect(() => {

        async function loadExpenses() {
            if (!user_id) {
                setLoading(false);
                return;
            }

            try {

                const data = await getUserExpenses(
                    `/api/expenses/${user_id}/${month}`
                );

                dispatch(setExpenses({
                    expenses: data.expenses,
                    total: data.total
                }))

            } catch (err) {

                console.error("Ошибка загрузки расходов", err);

            } finally {
                setLoading(false);
            }
        }

        loadExpenses();

    }, [month, dispatch, user_id]);
///////////////////////////////////////////////////////////////////////////////////


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


    // ✅ ОСНОВНОЙ ОТЧЁТ
    return (
        <div className="w-full max-w-[420px] mx-auto p-4 text-slate-100">

            <div className="text-xl font-semibold text-center mb-2">
                {monthDict[month] ?? month}
            </div>

            <h1 className="text-xl font-semibold text-center mb-4">
                {t('BudgetExpenses')}
            </h1>

            {/* Категории */}
            <div className="space-y-4">


                {orderedGroups.map(([category, data]) => {

                    return (
                        <div
                            key={category}
                            className="bg-slate-800 rounded-lg p-4"
                        >
                            {/* Заголовок категории */}
                            <h2 className="font-semibold mb-2">
                                {category}
                            </h2>

                            {/* Все расходы категории */}
                            {data.items.map(expense => (
                                <div
                                    key={expense.id}
                                    className={`flex justify-between text-sm transition-all duration-300
                        ${removingId === expense.id ? "opacity-0 translate-x-4" : ""}
                    `}
                                >
                    <span>
                        {expense.title || t("NoName")}
                    </span>

                                    <div className="flex items-center gap-2">
                                        <span>{expense.price}</span>

                                        <button
                                            onClick={() => setExpenseToDelete(expense.id)}
                                            className="text-gray-500 hover:text-gray-300 transition"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {/* Total категории */}
                            <div className="
                flex justify-between
                font-semibold mt-2
                border-t border-slate-600 pt-2
            ">
                                <span>{t("Total")}</span>
                                <span>{data.total}</span>
                            </div>
                        </div>
                    )
                })}


                {/* Общий итог */}
                <div className="
        mt-6 p-4
        bg-slate-700
        rounded-lg
        flex justify-between
        font-bold text-lg
      ">
                    <span>{t('Sum')}</span>
                    <span>{total}</span>
                </div>

                {expenseToDelete && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fadeIn">
                        <div className="bg-slate-800 p-6 rounded-xl w-[90%] max-w-[320px] shadow-xl">
                            <p className="text-white text-center mb-6">
                                {t('DeleteExpense')} ?
                            </p>

                            <div className="flex justify-between gap-4">
                                <button
                                    onClick={() => setExpenseToDelete(null)}
                                    disabled={deleting}
                                    className="
                        flex-1 py-2 rounded-lg
                        bg-slate-600
                        hover:bg-slate-500
                        transition
                    "
                                >
                                    {t("CancelNote")}
                                </button>

                                <button
                                    onClick={handleDeleteExpense}
                                    disabled={deleting}
                                    className="
                        flex-1 py-2 rounded-lg
                        bg-gray-500
                        hover:bg-gray-400
                        transition
                        disabled:opacity-50
                    "
                                >
                                    {deleting ? "in process..." : t("DeleteAct")}
                                </button>
                            </div>
                        </div>
                    </div>
                )}


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
                    {t('Back')}
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
                <SendReportButton
                    total={total}
                    month={month}
                    user_id={user_id}
                    lan={lan}
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
                            <ExpensesPie grouped={grouped} itog={total}/>
                        </div>
                    </Modal>
                )}
            </div>
        </div>
    )
}