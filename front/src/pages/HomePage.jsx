import {Link} from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect } from "react";
import { useTranslation } from "../features/customHoock"

export default function HomePage() {
    const wa = window.Telegram?.WebApp
    const { t } = useTranslation()

    const trataList = useSelector(
        state => state.expensesUser.trataList
    )

    console.log('trataList = ',trataList, '\n\nWA = ', wa)

    useEffect(() => {
        if (!wa?.initDataUnsafe?.user) return;

        fetch("/api/receive_telegram_data", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id: wa.initDataUnsafe.user.id,
                first_name: wa.initDataUnsafe.user.first_name,
                username: wa.initDataUnsafe.user.username,
            }),
        });
    }, []);

    return (
        <div
            className="
        w-full
        flex
        flex-col
        items-center
        bg-gradient-to-b
        from-zinc-800
        to-black
        px-6
        pt-8
      "
        >
            <div
                className="
                 text-black
          text-center
          text-3xl
          font-bold
          p-6
          drop-shadow-[0_0_2px_white]
        "
            >
                Finance Tracker
            </div>

            <p
                className="
          text-neutral-200
          text-xl
          tracking-wide
          mb-10
          text-center
        "
            >
                {t('Hello')}, {wa?.initDataUnsafe?.user?.first_name}
            </p>

            <div className="w-full flex flex-col gap-4">
                <Link
                    to="/expenses"
                    className="
                    bg-gradient-to-br
                    from-slate-300
                    via-slate-500
                    to-slate-800
                    text-white
                    py-4
                    rounded-xl
                    active:scale-95
                    text-center
                    text-lg"
                >
                    Мои расходы
                </Link>

                <Link
                    disabled
                    to="/incomes"
                    className="
                    bg-gradient-to-br
                    from-sky-400
                    via-sky-800
                    bg-sky-950
                    text-white
                    py-4
                    rounded-xl
                    active:scale-95
                    text-center
                    text-lg"
                >
                    Мои доходы
                </Link>
            </div>
        </div>
    )
}

