import {useDispatch} from 'react-redux'
import {addIncome} from '../../features/incomes/incomesSlice'
import {useState} from 'react'
import {formPost} from "../../app/formPost.js";
import {getTelegramUser} from "../../utils/tg.js";
import { useTranslation } from "../../features/customHoock";


export default function IncomeModal({onClose}) {

    const dispatch = useDispatch()
    const t = useTranslation()

    const [dohodName, setDohodName] = useState('')
    const [amount, setAmount] = useState('')
    const [saved, setSaved] = useState(false)
    const [loading, setLoading] = useState(false);

    async function handleSave() {
        if (!amount) return // цена обязательна

        const user = getTelegramUser()

        if (!user) return;


        const payload = {
            user_id: user.id,
            title: dohodName.trim() || null,
            amount: parseFloat(amount)
        }


        try {
            if (loading) return;
            setLoading(true);

            const data = await formPost("/api/incomes/add", payload);

            dispatch(addIncome(data.income));

            setSaved(true)

            setTimeout(() => {
                setSaved(false)
                onClose()
            }, 2000)


        } catch (error) {

            console.error("Ошибка сохранения:", error);
            alert("Error Network");

        } finally {
            setLoading(false);
        }

    }

    return (
        <div
            className="
        fixed
        inset-0
        bg-black/60
        flex
        items-center
        justify-center
        z-50
      "
        >
            <div className="
          w-[90%]
          max-w-[360px]
          bg-zinc-700
          rounded-xl
          p-5
          text-white
          shadow-xl
          border-2
          border-gray-500
        "
            >
                {saved ? (
                    <p className="text-green-400 text-lg text-center">
                        {t('SuccessSaved')}
                    </p>
                ) : (
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-center">
                            I N C O M E
                        </h3>

                        <div className="flex flex-col gap-3 mb-6">
                            <input
                                type="text"
                                placeholder="Name"
                                value={dohodName}
                                onChange={(e) => setDohodName(e.target.value)}
                                className="
              bg-zinc-600
              rounded-lg
              px-3
              py-2
              text-sm
              outline-none"
                            />

                            <input
                                type="number"
                                placeholder="Sum"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="
              bg-zinc-600
              rounded-lg
              px-3
              py-2
              text-sm
              outline-none
            "
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className={`flex-1 py-2 rounded-lg active:scale-95 text-sm
                                ${loading ? "bg-gray-500" : "bg-blue-500"}`}
                            >
                                 {loading ? "saving..." : "to save"}
                            </button>

                            <button
                                onClick={onClose}
                                className="
              flex-1
              bg-zinc-600
              py-2
              rounded-lg
              text-sm
              active:scale-95
            "
                            >
                                {t('Close')}
                            </button>


                        </div>
                    </div>)}
            </div>
        </div>
    )
}