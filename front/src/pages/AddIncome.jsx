import {useNavigate} from "react-router-dom";
import IncomeModal from "../components/rashod/IncomeModul.jsx";


export default function AddIncome() {
    const navigate = useNavigate()
    return (
        <>
            <IncomeModal onClose={() => navigate(-1)} />
        </>
    )
}