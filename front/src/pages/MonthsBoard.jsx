import MonthsGrid from "./MonthsGrid";
import ButtonBack from "../components/common/ButtonBack.jsx";
import { useNavigate } from 'react-router-dom'


export default function MonthsBoard() {

    const navigate = useNavigate()

    return (
        <div>
            <h2 className="text-center text-2xl mt-8 font-bold text-gray-100">
                2026
            </h2>

            <MonthsGrid
                onSelect={(month) => navigate(`/balance/${month}`)}
            />

            <div className="flex justify-center mt-6">
                <ButtonBack />
            </div>
        </div>
    )
}


