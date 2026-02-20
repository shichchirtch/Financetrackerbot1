import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
// import { useTranslation } from "../features/customHoock";

const Incomes = { 'ru':'Доходы',
    'uk':'Доходи',
    'de':'Einkommen',
    'tr':'Gelir'
}

const AddIncome = { 'ru':'Добавить доход',
    'uk':'Додати дохід',
    'de':'Einkommen hinzufügen',
    'tr':'Gelir ekle'
}

const Extract = { 'ru':'Выписка',
    'uk':'Витяг',
    'de':'Finanzbericht',
    'tr':'Finansal rapor'
}

const Back = { 'ru':'Назад',
    'uk':'Назад',
    'de':'Zurück',
    'tr':'Geri'
}

const NoIncomes = { 'ru':'Доходов пока нет',
    'uk':'Доходів поки що немає',
    'de':'Es gibt noch kein Einkommen',
    'tr':'Henüz gelir yok'
}



export default function IncomePage() {
    const dohodList = useSelector(
        state => state.incomesUser.dohodList
    )
    // const { t } = useTranslation()
    const lan =  useSelector(state => state.user.lan)
    return (
        <div className="w-full max-w-[420px] mx-auto p-6 text-slate-200">
            <h1 className="text-2xl font-bold text-center mb-8">
                {Incomes[lan]}
            </h1>

            <div className="flex flex-col gap-4">
                {/* Добавить доход */}
                <Link to="add">
                    <button className="w-full py-4 bg-gradient-to-br
                    from-slate-400 to-slate-500 rounded-lg
                    text-lg active:scale-95">
                        {AddIncome[lan]}
                    </button>
                </Link>

                {/* Мои доходы */}
                <Link to="list">
                    <button className="w-full py-4 bg-gradient-to-br
                     from-slate-500 to-slate-600 rounded-lg
                      text-lg active:scale-95">
                        {Extract[lan]}
                    </button>
                </Link>

                {/* Назад */}
                <Link to="/">
                    <button className="w-full py-4 bg-gradient-to-br
                     from-slate-700 to-slate-800 rounded-lg
                     text-lg active:scale-95">
                        {Back[lan]}
                    </button>
                </Link>
            </div>

            {dohodList.length === 0 && (
                <p className="text-center text-sm opacity-70 mt-6">
                    {NoIncomes[lan]}
                </p>
            )}
        </div>
    )
}
