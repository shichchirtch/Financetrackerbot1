import {useDispatch, useSelector} from 'react-redux'
import {addExpense} from '../../features/expenses/expensesSlice'
import {useState} from 'react'
import {formPost} from '../../app/formPost'
import { useTranslation } from "../../features/customHoock";


export default function ExpenseModal({category, onClose}) {

    const dispatch = useDispatch()

    const [thingName, setThingName] = useState('')
    const [price, setPrice] = useState('')
    const [saved, setSaved] = useState(false)
    const [loading, setLoading] = useState(false);

    const user_id =  useSelector(state => state.user.account?.user_id)
    const { t }  = useTranslation()

    async function handleSave() {
        if (!price || !user_id) return // цена обязательна



        const payload = {
            user_id: user_id,
            category,
            title: thingName.trim() || null,
            price: parseFloat(price)
        };

        try {
            if (loading) return;
            setLoading(true);

            const data = await formPost("/api/expenses/add", payload);

            dispatch(addExpense(data.expense));

            setSaved(true);

            setTimeout(() => {
                setSaved(false);
                onClose();
            }, 2000);

        } catch (error) {

            console.error("Ошибка сохранения:", error);
            alert("Network error. Расход не сохранён.");

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
            <div
                className="
          w-[90%] /* Ширина 90 %*/
          max-w-[360px] /* Но не больше 360 px */
          bg-zinc-700 /* Цвет фона */
          rounded-xl /* большие скругления углов */
          p-5 /* Паддинги 5 * 4 = 20 px */
          text-white
          shadow-xl /* крупная тень под элементом */
          border-2 /* Обводка 2 пикселя */
          border-cyan-700
        "
            >
                {saved ? (
                    <p className="text-green-400 text-lg
                         text-center h-16
                         font-bold
                        flex
                        items-center
                        justify-center">
                        {t('SuccessSaved')}
                    </p>
                ) : (
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-center">
                            {category}
                        </h3>

                        <div className="flex flex-col gap-3 mb-6">
                            <input
                                type="text"
                                placeholder="name"
                                value={thingName}
                                onChange={(e) => setThingName(e.target.value)}
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
                                placeholder="Sum"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
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
                                 {loading ? "Saving..." : t('ToSave')}
                            </button>

                            <button
                                onClick={onClose}
                                className="
              flex-1
              bg-zinc-600
              py-2
              rounded-lg
              text-sm
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