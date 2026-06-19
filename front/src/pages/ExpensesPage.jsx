// // pages/ExpensesPage.jsx
import {Link} from 'react-router-dom'
import {useState} from "react";
import ExpenseModal from '../components/rashod/ExpenseModal'
import {useSelector} from "react-redux";
import {useTranslation} from "../features/customHoock";
import CategoryModal from "./CategoryModal.jsx";

export default function ExpensesPage() {

    const [selectedCategory, setSelectedCategory] = useState(null)
    const [categoryModal, setCategoryModal] = useState(false)
    const categories = useSelector(state => state.category.spisokKategories);
    const {t} = useTranslation()

    return (
        <>
            <div className="w-full p-4
        text-white
        ">
                <h2 className="text-xl font-semibold mb-6 mt-4 text-center">
                    {t('ArtOfExpenses')}
                </h2>

                <button onClick={() => setCategoryModal(true)}
                        className="
            w-8
            h-8
            rounded-full
            bg-slate-700
            hover:bg-slate-600
            text-xl
            flex
            justify-center
            items-center"

                >
                    ＋
                </button>

                <div
                    className="
          grid
          grid-cols-2
          gap-3
        "
                >
                    {categories.map(category => (
                        <button
                            key={category}
                            className="
              h-16
              rounded-xl
              text-sm
              font-medium
              bg-gradient-to-br
              from-[#7489a3]
              to-[#2F3D45]
              hover:bg-[#6f8095]
              active:scale-95
              transition
              shadow-md
            "
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-4 mt-3 justify-items-center">
                    <Link to="/">
                        <button className="px-12 py-1.5
                         bg-gradient-to-br
                    from-sky-400
                    to-sky-950
                    active:scale-95
                        rounded-lg">
                            {t('Back')}
                        </button>

                    </Link>

                    <Link to="/balance">
                        <button className=" py-1.5 px-12
                           bg-gradient-to-br
                    from-cyan-400
                    bg-sky-950
                    active:scale-95
                        rounded-lg">
                            {t('Budget')}
                        </button>
                    </Link>
                </div>
            </div>
            {selectedCategory && (
                <ExpenseModal
                    category={selectedCategory}
                    onClose={() => setSelectedCategory(null)}
                />
            )}
            {categoryModal && (
                <CategoryModal onClose={() => setCategoryModal(false)}/>
            )}
        </>

    )
}

