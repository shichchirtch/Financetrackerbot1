import { useSelector } from "react-redux"
import { translations } from "../utils/i18nconfig"

export function useTranslation() {

     const lan = useSelector(state => state.user.lan)  || "ru"

    function t(key) {
        return translations[lan]?.[key] ?? key
    }


    // function t(key) {
    //     const key_for_dict = translations?.[lan]?.[key] ?? key
    //     console.log('key_for_dict = ', key_for_dict)
    //     return key_for_dict
    // }

    return { t }
}
