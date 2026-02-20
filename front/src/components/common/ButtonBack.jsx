import { Link } from "react-router-dom";
import {useSelector} from "react-redux";
// import { useTranslation } from "../../features/customHoock";
const Back = { 'ru':'Назад',
    'uk':'Назад',
    'de':'Zurück',
    'tr':'Geri'
}

export default function ButtonBack() {
    // const t = useTranslation()
    const lan =  useSelector(state => state.user.lan)
    return (
        <div>
            <Link to="/">
                <button className="px-12 py-1.5
                         bg-gradient-to-br
                    from-sky-400
                    to-sky-950
                    active:scale-95
                        rounded-lg
                        m-7
                        text-blue-100">
                    ← {Back[lan]}
                </button>
            </Link>
        </div>
    )
}