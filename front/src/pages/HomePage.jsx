import {Link} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {useEffect} from "react";
import {setUser, setLanguage} from "../features/user/userSlice"


const start_spisok = {
    'ru': "Привет",
    'de': 'Guten Tag',
    'uk': 'Привіт',
    'tr': 'Merhaba'
}

const moi_rashkdy = {
    'ru': 'Мои расходы',
    'de': 'Meine Ausgaben',
    'uk': 'Мої витрати',
    'tr': 'Masraflarım'
}

const moi_dohosy = {
    'ru': 'Мои доходы',
    'de': 'Mein Einkommen',
    'uk': 'Мої доходи',
    'tr': 'Gelirim'
}

export default function HomePage() {
    const dispatch = useDispatch()

    const supported = ["ru", "de", "uk", "tr"]
    const wa = window.Telegram?.WebApp
    const first_name = wa.initDataUnsafe.user.first_name

    const tg_lan = wa?.initDataUnsafe?.user?.language_code

    const start_lan = supported.includes(tg_lan) ? tg_lan : "ru"

    const name_user = first_name//useSelector(state => state.user.user)

    useEffect(() => {
        if (name_user) return
        if (!wa?.initDataUnsafe?.user) return

        const tgUser = wa.initDataUnsafe.user

        const front_user = {
            user_id: tgUser.id,
            first_name
        }

        dispatch(setUser(front_user))

        async function initUser() {
            try {
                const response = await fetch("/api/receive_telegram_data", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        user_id: front_user.user_id,
                        first_name: front_user.first_name,
                    }),
                })

                const data = await response.json()

                // 🔥 Вот здесь мы получаем язык из Redis
                dispatch(setLanguage(data.lan))

            } catch (err) {
                console.error("Init error:", err)
                dispatch(setLanguage(start_lan)) // fallback
            }
        }

        initUser()

    }, [name_user])

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
                {start_spisok[start_lan]}, {first_name}
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
                    {moi_rashkdy[start_lan]}
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
                    {moi_dohosy[start_lan]}
                </Link>
            </div>
        </div>
    )
}

