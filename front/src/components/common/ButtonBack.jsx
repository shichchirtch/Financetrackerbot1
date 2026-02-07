import {Link} from "react-router-dom";


export default function ButtonBack() {
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
                    ← Назад
                </button>
            </Link>
        </div>
    )
}