import {useDispatch} from 'react-redux'
import {addExpense} from '../../features/expenses/expensesSlice'
import {useState} from 'react'
import {formPost} from '../../app/formPost'
import {getTelegramUser} from '../../utils/tg'



export default function ExpenseModal({category, onClose}) {

    const dispatch = useDispatch()

    const [thingName, setThingName] = useState('')
    const [price, setPrice] = useState('')
    const [saved, setSaved] = useState(false)
    const [loading, setLoading] = useState(false);


    async function handleSave() {
        if (!price) return // цена обязательна

        const user = getTelegramUser()

        if (!user) return;


        const payload = {
            user_id: user.id,
            category,
            title: thingName.trim() || null,
            price: parseFloat(price),
            createdAt: Date.now(),
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
            alert("Ошибка сети. Расход не сохранён.");

        } finally {
            setLoading(false);
        }

    }

    return (
        <div
            className="
        fixed /*Элемент привязывается к окну и не скролится*/
        inset-0 /* В сочетании с fixed  означает занять весь экран*/
        bg-black/60 /* Фон чёрный с прозрачностью 60%*/
        flex /*Индикатор центрирования элементов */
        items-center /* по вертикали */
        justify-center /* по горизотнали */
        z-50 /* Поднимает элемент над большинством интерфейса */
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
                        ✅ Успешно сохранено
                    </p>
                ) : (
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-center">
                            {category}
                        </h3>

                        <div className="flex flex-col gap-3 mb-6">
                            <input
                                type="text"
                                placeholder="Наименование (необязательно)"
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
                                placeholder="Сумма"
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
                                className="
              flex-1
              bg-blue-500
              py-2
              rounded-lg
              text-sm
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