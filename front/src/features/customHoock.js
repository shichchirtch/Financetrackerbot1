import { useSelector } from "react-redux"
import { translations } from "../utils/i18nconfig"

export function useTranslation() {

     const lan = useSelector(state => state.user.lan)  || "ru"

    function t(key) {
        return translations[lan]?.[key] ?? key
    }

    return { t }
}
