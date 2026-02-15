import { Link } from "react-router-dom"
import { useSelector } from "react-redux"

export default function IncomePage() {
    const dohodList = useSelector(
        state => state.incomesUser.dohodList
    )

    return (
        <div className="w-full max-w-[420px] mx-auto p-6 text-slate-200">
            <h1 className="text-2xl font-bold text-center mb-8">
                Доходы
            </h1>

            <div className="flex flex-col gap-4">
                {/* Добавить доход */}
                <Link to="add">
                    <button className="w-full py-4 bg-slate-600 rounded-lg text-lg active:scale-95">
                        Добавить доход
                    </button>
                </Link>

                {/* Мои доходы */}
                <Link to="list">
                    <button className="w-full py-4 bg-slate-700 rounded-lg text-lg active:scale-95">
                        Выписка
                    </button>
                </Link>

                {/* Назад */}
                <Link to="/">
                    <button className="w-full py-4 bg-slate-500 rounded-lg text-lg active:scale-95">
                        Назад
                    </button>
                </Link>
            </div>

            {dohodList.length === 0 && (
                <p className="text-center text-sm opacity-70 mt-6">
                    Доходов пока нет
                </p>
            )}
        </div>
    )
}
