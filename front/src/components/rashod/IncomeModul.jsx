import { useDispatch } from 'react-redux'
import { addIncome } from '../../features/incomes/incomesSlice'
import { useState } from 'react'
// import {addIncome} from "../../features/incomes/incomesSlice.js";


export default function IncomeModal({ onClose }) {

    const dispatch = useDispatch()

    const [dohodName, setDohodName] = useState('')
    const [amount, setAmount] = useState('')
    const [saved, setSaved] = useState(false)


    function handleSave() {
        if (!amount) return // цена обязательна

        dispatch(
            addIncome({
                title: dohodName.trim() || null,
                amount: Number(amount),
                createdAt: Date.now(),
            })
        )

        setSaved(true)

        setTimeout(() => {
            setSaved(false)
            onClose()
        }, 2000)


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
                        ✅ Успешно сохранено
                    </p>
                ) : (
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-center">
                            I N C O M E
                        </h3>

                        <div className="flex flex-col gap-3 mb-6">
                            <input
                                type="text"
                                placeholder="Наименование (необязательно)"
                                value={dohodName}
                                onChange={(e) => setDohodName(e.target.value)}
                                className="
              bg-zinc-600
              rounded-lg
              px-3
              py-2
              text-sm
              outline-none
            "

                            />

                            <input
                                type="number"
                                placeholder="Сумма"
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
                                className="
              flex-1
              bg-blue-500
              py-2
              rounded-lg
              text-sm
              active:scale-95
            "
                                onClick={handleSave}

                            >
                                Сохранить
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
                                Закрыть
                            </button>


                        </div>
                    </div>)}
            </div>
        </div>
    )
}