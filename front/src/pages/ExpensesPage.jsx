// // pages/ExpensesPage.jsx
import {Link} from 'react-router-dom'
import {useState, useRef, useEffect} from "react";
import ExpenseModal from '../components/rashod/ExpenseModal'
import {useSelector} from "react-redux";
import {useTranslation} from "../features/customHoock";
import CategoryModal from "./CategoryModal.jsx";
import DeleteCategoryModal from "./DeleteCategotiesModul.jsx";
import RenameCategoryModal from "./RenameCategoryModal.jsx";
import CurrencyModal from "./CurrencyModal.jsx";
import CategoryButton from "../components/category/CategoryButton";
import {DndContext, closestCenter, PointerSensor, TouchSensor, useSensor, useSensors} from "@dnd-kit/core";
import {SortableContext, rectSortingStrategy, arrayMove} from "@dnd-kit/sortable";


export default function ExpensesPage() {

    const [selectedCategory, setSelectedCategory] = useState(null)
    const [categoryModal, setCategoryModal] = useState(false)
    const categories = useSelector(state => state.category.spisokKategories);
    const {t} = useTranslation()
    const [menuOpen, setMenuOpen] = useState(false);
    const [orderedCategories, setOrderedCategories] = useState([]);

    const [deleteCategoryModal, setDeleteCategoryModal] = useState(false);

    const [renameCategoryModal, setRenameCategoryModal] = useState(false);

    const [currencyModal, setCurrencyModal] = useState(false);
    const menuRef = useRef(null);
    const currency = useSelector(state => state.currency.currency);

    const sensors = useSensors(useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 200,
                tolerance: 8,
            },
        })
    );

    useEffect(() => {

        function handleClickOutside(event) {

            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setMenuOpen(false);
            }

        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };

    }, []);

    useEffect(() => {

        setOrderedCategories(categories);

    }, [categories]);

    function handleDragEnd(event) {

        const {active, over} = event;

        if (!over || active.id === over.id) return;

        const oldIndex = orderedCategories.indexOf(active.id);
        const newIndex = orderedCategories.indexOf(over.id);

        setOrderedCategories(
            arrayMove(
                orderedCategories,
                oldIndex,
                newIndex
            )
        );

    }

    return (
        <>
            <div className="w-full p-4
        text-white
        ">
                <div className="flex items-center justify-between mb-6 mt-4">

                    <h2 className="text-xl font-semibold">
                        {t("ArtOfExpenses")}
                    </h2>

                    <div
                        ref={menuRef}
                        className="relative"
                    >

                        <button
                            onClick={() => setMenuOpen(prev => !prev)}
                            className="
                w-8
                h-8
                rounded-lg
                bg-slate-700
                hover:bg-slate-600
                active:scale-95
                transition
                flex
                items-center
                justify-center
            "
                        >
                            ☰
                        </button>

                        {menuOpen && (

                            <div
                                className="
                absolute
                right-0
                mt-2
    w-60
    rounded-xl
    bg-slate-800
    shadow-xl
    border
    border-slate-700
    z-50
    origin-top-right
    transition-all
    duration-200"
                            >


                                <button
                                    onClick={() => {
                                        setMenuOpen(false);
                                        setCategoryModal(true);
                                    }}
                                    className="
                    w-full
                    text-left
                    px-4
                    py-3
                    hover:bg-slate-700
                "
                                >
                                    ➕ {t("AddCategory")}
                                </button>

                                <button
                                    onClick={() => {
                                        setMenuOpen(false);
                                        setRenameCategoryModal(true);
                                    }}
                                    className="
                    w-full
                    text-left
                    px-4
                    py-3
                    hover:bg-slate-700
                "
                                >
                                    ✏️ {t("RenameCategory")}
                                </button>

                                <button
                                    onClick={() => {
                                        setMenuOpen(false);
                                        setDeleteCategoryModal(true);
                                    }}
                                    className="
                    w-full
                    text-left
                    px-4
                    py-3
                    hover:bg-slate-700
                "
                                >
                                    🗑 {t("DeleteCategory")}
                                </button>

                                <div className="border-t border-slate-600"/>

                                <button
                                    onClick={() => {
                                        setMenuOpen(false);
                                        setCurrencyModal(true);
                                    }}
                                    className="
                    w-full
                    text-left
                    px-4
                    py-3
                    hover:bg-slate-700
                "
                                >
                                    💶 {t("Currency")}
                                </button>

                            </div>

                        )}

                    </div>
                </div>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >

                    <SortableContext
                        items={orderedCategories}
                        strategy={rectSortingStrategy}
                    >

                        <div className="grid grid-cols-2 gap-3">
                            {orderedCategories.map(category => (

                                <CategoryButton

                                    key={category}

                                    category={category}

                                    onClick={() => setSelectedCategory(category)}

                                />

                            ))}

                            {/*        {categories.map(category => (*/}
                            {/*            <button*/}
                            {/*                key={category}*/}
                            {/*                className="*/}
                            {/*  h-16*/}
                            {/*  rounded-xl*/}
                            {/*  text-sm*/}
                            {/*  font-medium*/}
                            {/*  bg-gradient-to-br*/}
                            {/*  from-[#7489a3]*/}
                            {/*  to-[#2F3D45]*/}
                            {/*  hover:bg-[#6f8095]*/}
                            {/*  active:scale-95*/}
                            {/*  transition*/}
                            {/*  shadow-md*/}
                            {/*"*/}
                            {/*                onClick={() => setSelectedCategory(category)}*/}
                            {/*            >*/}
                            {/*                {category}*/}
                            {/*            </button>*/}
                            {/*        ))}*/}
                        </div>
                    </SortableContext>
                </DndContext>

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

            {deleteCategoryModal && (
                <DeleteCategoryModal
                    onClose={() => setDeleteCategoryModal(false)}
                />
            )}

            {renameCategoryModal && (
                <RenameCategoryModal
                    onClose={() => setRenameCategoryModal(false)}
                />
            )}

            {currencyModal && (
                <CurrencyModal
                    onClose={() => setCurrencyModal(false)}
                />
            )}

        </>

    )
}

