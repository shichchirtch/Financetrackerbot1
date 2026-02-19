import MonthsGrid from "./MonthsGrid";
import ButtonBack from "../components/common/ButtonBack.jsx";
import { useNavigate } from 'react-router-dom'

export default function MonthsBoard() {
    const navigate = useNavigate()

    function goToBalance(month) {
        console.log("NAV FUNC TYPE =", typeof navigate)
        navigate(`/balance/${month}`)
    }

    return (
        <MonthsGrid onSelect={goToBalance} />

    )
}






// export default function MonthsBoard() {
//     console.log("MONTHBOARD 19.02-1")
//     const navigate = useNavigate()
//     console.log("typeof navigate =", typeof navigate)
//
//     return (
//         <div>
//             <h2 className="text-center text-2xl mt-8 font-bold text-gray-100">
//                 2026
//             </h2>
//
//             <MonthsGrid
//                 onSelect={(month) => navigate(`/balance/${month}`)}
//             />
//             <div className="flex justify-center mt-6">
//                 <ButtonBack />
//             </div>
//         </div>
//     )
// }


