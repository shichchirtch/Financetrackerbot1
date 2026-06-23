import {useState} from "react";
import {useSelector} from "react-redux";
import {formPost} from "../app/formPost.js";
import {useTranslation} from "../features/customHoock";
import {useDispatch} from "react-redux";
import {addCategory} from "../features/category/categorySlice";

export default function CategoryModal({onClose}) {

    const {t} = useTranslation();

    const user_id = useSelector(state => state.user.account?.user_id);
     const categories = useSelector(state => state.category.spisokKategories);

    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch()



    async function handleAdd() {

        const name = category.trim();

        if (!name) return;
        if (categories.includes(name)) {
            alert("CategoryAlreadyExists");
            return;
        }

        setLoading(true);

        try {

            await formPost("/api/categories", {user_id, category: name});
            dispatch(addCategory(name));
            onClose();

        } catch (err) {

            console.error(err);

            alert("Ошибка создания категории");

        } finally {

            setLoading(false);

        }

    }

    return (

        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">

            <div className="w-80 rounded-xl bg-slate-800 p-5 shadow-xl">

                <h2 className="text-xl text-white font-semibold mb-4 text-center">
                    {t("NewCategory")}
                </h2>

                <input

                    value={category}

                    onChange={(e) => setCategory(e.target.value)}

                    maxLength={15}

                    placeholder={t("CategoryName")}

                    className="
                        w-full
                        rounded-lg
                        p-2
                        mb-5
                        bg-slate-700
                        text-white
                        outline-none
                        border border-slate-600
                        focus:border-sky-500
                    "
                />

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

                        disabled={!category.trim() || loading}

                        onClick={handleAdd}

                        className="
                            px-4
                            py-2
                            rounded-lg
                            bg-sky-600
                            text-white
                            disabled:opacity-40
                        "
                    >
                        {loading ? "..." : "+"}
                    </button>

                </div>

            </div>

        </div>

    );

}