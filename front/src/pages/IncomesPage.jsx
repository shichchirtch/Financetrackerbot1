import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { useTranslation } from "../features/customHoock";

export default function IncomePage() {

    const { t } = useTranslation()
    return (
        <div className="w-full max-w-[420px] mx-auto p-6 text-slate-200">
            <h1 className="text-2xl font-bold text-center mb-8">
                {t('Incomes')}
            </h1>

            <div className="flex flex-col gap-4">
                {/* Добавить доход */}
                <Link to="add">
                    <button className="w-full py-4 bg-gradient-to-br
                    from-slate-400 to-slate-500 rounded-lg
                    text-lg active:scale-95">
                        {t('AddIncome')}
                    </button>
                </Link>

                {/* Мои доходы */}
                <Link to="list">
                    <button className="w-full py-4 bg-gradient-to-br
                     from-slate-500 to-slate-600 rounded-lg
                      text-lg active:scale-95">
                        {t("Extract")}
                    </button>
                </Link>

                {/* Назад */}
                <Link to="/">
                    <button className="w-full py-4 bg-gradient-to-br
                     from-slate-700 to-slate-800 rounded-lg
                     text-lg active:scale-95">
                        {t('Back')}
                    </button>
                </Link>
            </div>
        </div>
    )
}
