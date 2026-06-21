import {useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {formPost} from "../app/formPost";
import {useTranslation} from "../features/customHoock";
import {setCurrency} from "../features/currency/currencySlice";

const currencies = [
    {
        code: "€",
        title: "€ Euro"
    },
    {
        code: "USD",
        title: "$ Dollar"
    },
    {
        code: "RUB",
        title: "₽ Рубль"
    },
    {
        code: "UAH",
        title: "₴ Гривна"
    }
];

export default function CurrencyModal({onClose}) {

    const {t} = useTranslation();

    const dispatch = useDispatch();

    const user_id = useSelector(
        state => state.user.account?.user_id
    );

    const currentCurrency = useSelector(
        state => state.currency.currency
    );

    const [selectedCurrency, setSelectedCurrency] =
        useState(currentCurrency);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    async function handleSave() {

        if (!selectedCurrency) return;

        setError("");
        setLoading(true);

        try {

            const data = await formPost(
                "/api/settings/currency",
                {
                    user_id,
                    currency: selectedCurrency
                }
            );

            if (data.status === "error") {

                setError(data.message);

                return;
            }

            dispatch(setCurrency(selectedCurrency));

            onClose();

        } catch (err) {

            console.error(err);

            alert("Ошибка сохранения");

        } finally {

            setLoading(false);

        }

    }

    return (

        <div className="fixed inset-0 bg-black/60 flex justify-center items-start pt-16 z-50">

            <div className="w-80 rounded-xl bg-slate-800 p-5 shadow-xl">

                <h2 className="text-xl text-white font-semibold mb-4 text-center">
                    {t("Currency")}
                </h2>

                <div className="space-y-2 mb-5">

                    {currencies.map(currency => (

                        <button

                            key={currency.code}

                            onClick={() =>
                                setSelectedCurrency(currency.code)
                            }

                            className={`
                                w-full
                                rounded-lg
                                p-3
                                text-left
                                transition
                                ${
                                    selectedCurrency === currency.code
                                        ? "bg-sky-700 text-white"
                                        : "bg-slate-700 hover:bg-slate-600 text-white"
                                }
                            `}
                        >
                            {currency.title}
                        </button>

                    ))}

                </div>

                {error && (

                    <div
                        className="
                            bg-red-900/40
                            border
                            border-red-500
                            rounded-lg
                            p-2
                            text-red-300
                            text-sm
                            mb-4
                        "
                    >
                        {error}
                    </div>

                )}

                <div className="flex justify-end gap-3">

                    <button

                        onClick={onClose}

                        className="
                            px-4
                            py-2
                            rounded-lg
                            bg-slate-600
                            text-white
                        "
                    >
                        {t("CancelNote")}
                    </button>

                    <button

                        disabled={loading}

                        onClick={handleSave}

                        className="
                            px-4
                            py-2
                            rounded-lg
                            bg-sky-600
                            text-white
                            disabled:opacity-40
                        "
                    >
                        {loading ? "..." : t("ToSave")}
                    </button>

                </div>

            </div>

        </div>

    );

}