import {useSelector, useDispatch} from 'react-redux'
import {useState, useEffect} from 'react'
import MonthsGrid from './MonthsGrid'
import ButtonBack from '../components/common/ButtonBack'
import ReportMonthIncomes from './ReportMonthIncomes'
import {getUserIncomes} from "../app/getUserIncomes";
import {setIncome} from "../features/incomes/incomesSlice";


export default function MonthsBoardForIncomes() {
    const dispatch = useDispatch()
    const user_id =  useSelector(state => state.user.account?.user_id)

    const dohodList = useSelector(
        state => state.incomesUser.dohodList
    )
    console.log('DOHOD List = ', {dohodList})
    const [activeMonth, setActiveMonth] = useState(null)
    const [loading, setLoading] = useState(false)
    const [total, setTotal] = useState(0)

    // 🔥 Когда выбран месяц — загружаем данные
    useEffect(() => {
        if (!activeMonth || !user_id) return

        async function loadMonth() {

            try {
                setLoading(true)

                const data = await getUserIncomes(
                    `/api/incomes/${user_id}/${activeMonth}`
                )
                console.log("FROM BACKEND:", data)

                dispatch(setIncome(data.incomes))
                setTotal(data.total)

                // console.log("Redux after setIncome:", dohodList)


            } catch (err) {
                console.error("Ошибка загрузки доходов", err)
            } finally {
                setLoading(false)
            }
        }

        loadMonth()

    }, [activeMonth, user_id, dispatch])

    // 1️⃣ Пока месяц не выбран — показываем календарь
    if (!activeMonth) {
        return (
            <div>
                <h2 className="mt-8 text-[30px] font-bold text-gray-100 flex justify-center">
                    2026
                </h2>

                <MonthsGrid onSelect={setActiveMonth}/>

                <div className="flex justify-center">
                    <ButtonBack/>
                </div>
            </div>
        )
    }

    // 2️⃣ Если грузим
    if (loading) {
        return <div className="text-center mt-20 text-white">Loading...</div>
    }

    // 3️⃣ Показ отчёта
    return (
        <ReportMonthIncomes
            incomes={dohodList}
            total={total}
            month={activeMonth}
            onBack={() => setActiveMonth(null)}
        />
    )
}


// export default function MonthsBoardForIncomes() {
//     const dohodList = useSelector(
//         state => state.incomesUser.dohodList
//     )
//
//     const [activeMonth, setActiveMonth] = useState(null)
//
//     // 1️⃣ Пока месяц не выбран — показываем сетку
//     if (!activeMonth) {
//         return (
//             <div>
//                 <h2
//                     className="
//                         mt-8
//                         text-[30px]
//                         font-bold
//                         text-gray-100
//                         flex
//                         justify-center
//                     "
//                 >
//                     2026
//                 </h2>
//
//                 <MonthsGrid onSelect={setActiveMonth} />
//
//                 <div className="flex justify-center">
//                     <ButtonBack />
//                 </div>
//             </div>
//         )
//     }
//
//     // 2️⃣ Фильтрация доходов по месяцу
//     const filtered = dohodList.filter(item =>
//         item.date.startsWith(activeMonth)
//     )
//
//     return (
//         <ReportMonthIncomes
//             incomesForMonth={filtered}
//             month={activeMonth}
//             onBack={() => setActiveMonth(null)}
//         />
//     )
// }
