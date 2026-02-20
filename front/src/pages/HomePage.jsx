import {Link} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {useEffect} from "react";
import {setLanguage} from "../features/user/userSlice"


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
    const front_user = useSelector(state => state.user.user)
    const user_id = front_user?.id
    const name_user = useSelector(state => state.user.user?.first_name)
    const lan = useSelector(state => state.user.lan)


    useEffect(() => {
        if (!user_id) return

        async function initUser() {
            try {
                const response = await fetch("/api/receive_telegram_data", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        user_id: user_id,
                        first_name: name_user,
                    }),
                })

                const data = await response.json()
                dispatch(setLanguage(data.lan))

            } catch (err) {
                console.error("Init error:", err)
            }
        }

        initUser()

    }, [user_id])

    if (!front_user) {
        return <div>Loading...</div>
    }

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
                {start_spisok[lan]}, {name_user}
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
                    {moi_rashkdy[lan]}
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
                    {moi_dohosy[lan]}
                </Link>
            </div>
        </div>
    )
}

