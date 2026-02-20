import MonthsGrid from "./MonthsGrid";
import ButtonBack from "../components/common/ButtonBack.jsx";
import { useNavigate } from 'react-router-dom'

// export default function MonthsBoard() {
//     const navigate = useNavigate();
//
//     function goToBalance(month) {
//         console.log("NAV FUNC TYPE =", typeof navigate);
//         navigate(`/balance/${month}`);
//     }
//
//     return (
//         <div className="min-h-screen flex flex-col items-center pt-10 px-4">
//
//             <h2 className="text-3xl font-bold text-gray-100 mb-8">
//                 2026
//             </h2>
//
//             <div className="w-full max-w-md">
//                 <MonthsGrid onSelect={goToBalance} />
//             </div>
//
//             <div className="mt-10">
//                 <ButtonBack />
//             </div>
//
//         </div>
//     );
// }






export default function MonthsBoard() {
    const navigate = useNavigate()

    function goToBalance(month) {
        console.log("NAV FUNC TYPE =", typeof navigate)
        navigate(`/balance/${month}`)
    }

    return (<div>
        <div>
        <MonthsGrid onSelect={goToBalance} />
            </div>
        <div className="mt-10">
                <ButtonBack />         </div>
        </div>

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


