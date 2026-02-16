import { useSelector } from "react-redux"
import { translations } from "../utils/i18nconfig"

export function useTranslation() {
    const lan = useSelector(state => state.user.language)

    function t(key) {
        return translations[lan]?.[key] || key
    }
    console.log('t = ', t)
    return { t }
}
