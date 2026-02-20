import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { setUser, setLanguage } from "./features/user/userSlice"

export default function TelegramInitializer() {
    const dispatch = useDispatch()

    useEffect(() => {
        const wa = window.Telegram?.WebApp
        const tgUser = wa?.initDataUnsafe?.user

        if (!tgUser) return

        dispatch(setUser({
            id: tgUser.id,
            first_name: tgUser.first_name,
        }))

        const supported = ["ru", "de", "uk", "tr"]

        const lan = supported.includes(tgUser.language_code)
            ? tgUser.language_code
            : "ru"

        dispatch(setLanguage({ lan }))

    }, [])

    return null
}