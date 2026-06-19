import {useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {formPost} from "../app/formPost";
import {useTranslation} from "../features/customHoock";
import {removeCategory} from "../features/category/categorySlice";

export default function DeleteCategoryModal({onClose}) {

    const {t} = useTranslation();

    const dispatch = useDispatch();

    const user_id = useSelector(
        state => state.user.account?.user_id);

    const categories = useSelector(
        state => state.category.spisokKategories);

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleDelete() {

        if (!selectedCategory) return;
        setError("");

        setLoading(true);

        try {

            const data = await formPost("/api/categories/delete", {
                user_id,
                category: selectedCategory
            });

            if (data.status === "error") {
                setError(data.message);
                return;
            }

            dispatch(removeCategory(selectedCategory));

            onClose();

        } catch (err) {

            console.error(err);

            alert("Ошибка удаления категории");

        } finally {

            setLoading(false);

        }

    }

    return (

        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">

            <div className="w-80 rounded-xl bg-slate-800 p-5 shadow-xl">

                <h2 className="text-xl text-white font-semibold mb-4 text-center">
                    {t("DeleteCategory")}
                </h2>

                <div className="max-h-72 overflow-y-auto space-y-2 mb-5">

                    {categories.map(category => (

                        <button

                            key={category}

                            onClick={() => setSelectedCategory(category)}

                            className={`
                                w-full
                                rounded-lg
                                p-3
                                text-left
                                transition
                                ${
                                selectedCategory === category
                                    ? "bg-red-700 text-white"
                                    : "bg-slate-700 hover:bg-slate-600 text-white"
                            }
                            `}
                        >
                            {category}
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

                        disabled={!selectedCategory || loading}

                        onClick={handleDelete}

                        className="
                            px-4
                            py-2
                            rounded-lg
                            bg-red-600
                            text-white
                            disabled:opacity-40
                        "
                    >
                        {loading ? "..." : t("DeleteCategory")}
                    </button>
                </div>
            </div>
        </div>
    );
}