import {useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {formPost} from "../app/formPost";
import {useTranslation} from "../features/customHoock";
import {renameCategory} from "../features/category/categorySlice";

export default function RenameCategoryModal({onClose}) {

    const {t} = useTranslation();

    const dispatch = useDispatch();

    const user_id = useSelector(
        state => state.user.account?.user_id
    );

    const categories = useSelector(
        state => state.category.spisokKategories
    );

    const [selectedCategory, setSelectedCategory] = useState("");
    const [newName, setNewName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleRename() {

        const name = newName.trim();

        if (!selectedCategory || !name) return;

        setError("");
        setLoading(true);

        try {

            const data = await formPost("/api/categories/rename", {
                user_id,
                old_name: selectedCategory,
                new_name: name
            });

            if (data.status === "error") {
                setError(data.message);
                return;
            }

            dispatch(renameCategory({
                oldName: selectedCategory,
                newName: name
            }));

            setNewName("");

            setSelectedCategory(null);

            onClose();

        } catch (err) {

            console.error(err);
            alert("Ошибка переименования");

        } finally {

            setLoading(false);

        }

    }

    return (

        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">

            <div className="w-80 rounded-xl bg-slate-800 p-5 shadow-xl">

                <h2 className="text-xl text-white font-semibold mb-4 text-center">
                    {t("RenameCategory")}
                </h2>

                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="
                        w-full
                        rounded-lg
                        p-2
                        mb-4
                        bg-slate-700
                        text-white
                        border border-slate-600
                    "
                >

                    <option value="">
                        {t("SelectCategory")}
                    </option>

                    {categories.map(category => (

                        <option
                            key={category}
                            value={category}
                        >
                            {category}
                        </option>

                    ))}

                </select>

                <input

                    value={newName}

                    onChange={(e) => setNewName(e.target.value)}

                    placeholder={t("NewCategoryName")}

                    className="
                        w-full
                        rounded-lg
                        p-2
                        mb-5
                        bg-slate-700
                        text-white
                        border border-slate-600
                    "
                />

                {error && (
                    <div className="
                        bg-red-900/40
                        border
                        border-red-500
                        rounded-lg
                        p-2
                        text-red-300
                        text-sm
                        mb-4
                    ">
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

                        disabled={
                            !selectedCategory ||
                            !newName.trim() ||
                            loading
                        }

                        onClick={handleRename}

                        className="
                            px-4
                            py-2
                            rounded-lg
                            bg-sky-600
                            text-white
                            disabled:opacity-40
                        "
                    >
                        {loading ? "..." : t("Save")}
                    </button>

                </div>

            </div>

        </div>

    );

}