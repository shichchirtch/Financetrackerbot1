import { useSelector } from "react-redux"
import { useState } from "react"
import { groupIncomesByMonth, buildMonthReport } from "../utils/incomesCount"
import {Link, useNavigate} from "react-router-dom";
import IncomeModal from "../components/rashod/IncomeModul.jsx";
// import  ButtonBack  from '../components/common/ButtonBack'

export default function AddIncome() {
    const navigate = useNavigate()
    return (
        <>
            <IncomeModal onClose={() => navigate(-1)} />
        </>
    )
}