// // pages/ExpensesPage.jsx
import {Link} from 'react-router-dom'
import {useState} from "react";
import ExpenseModal from '../components/rashod/ExpenseModal'
import {useSelector} from "react-redux";

const categories_ru = [
    'Продукты',
    'Аренда',
    'Транспорт',
    'Связь и Интернет',
    'Подарки',
    'Развлечения',
    'Налоги',
    'Путешествия',
    'Лекарства',
    'Одежда / Косметика',
    'Для дома',
    'Благотворительность',
    'Учёба',
    'Хобби',
    'Спорт',
    'Иное',
]
const categories_tr = ['Market',
'Kira',
'Ulaşım',
'İletişim ve İnternet',
'Hediyeler',
'Eğlence',
'Vergiler',
'Seyahat',
'İlaçlar',
'Giyim/Kozmetik',
'Ev',
'Hayır Kurumu',
'Eğitim',
'Hobiler',
'Spor',
'Diğer']

const categories_de = ['Lebensmittel',
'Miete',
'Transport',
'Kommunikation und Internet',
'Geschenke',
'Unterhaltung',
'Steuern',
'Reisen',
'Medikamente',
'Kleidung/Kosmetik',
'Wohnen',
'Wohltätigkeit',
'Studium',
'Hobbys',
'Sport',
'Sonstiges']
const categories_uk = ['Продукти',
'Оренда',
'Транспорт',
'Звязок та Інтернет',
'Подарунки',
'Розваги',
'Податки',
'Подорожі',
'Ліки',
'Одяг / Косметика',
'Для дому',
'Благодійність',
'Навчання',
'Хоббі',
'Спорт',
'Інше',]

const categories_dict = {
    'ru':categories_ru,
    'uk':categories_uk,
    'de':categories_de,
    'tr':categories_tr
}

export default function ExpensesPage() {

    const [selectedCategory, setSelectedCategory] = useState(null)

    const trataList = useSelector(
        state => state.expensesUser.trataList
    )
    const lan =  useSelector(state => state.user.lan)

    console.log('TRATALIST = ', trataList)


    return (
        <>
            <div className="w-full p-4
        text-white
        ">
                <h2 className="text-xl font-semibold mb-6 mt-4 text-center">
                    Категории расходов
                </h2>

                <div
                    className="
          grid
          grid-cols-2
          gap-3
        "
                >
                    {categories_dict[lan].map((category) => (
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
                            ← Назад
                        </button>

                    </Link>

                    <Link to="/balance">
                        <button className=" py-1.5 px-12
                           bg-gradient-to-br
                    from-cyan-400
                    bg-sky-950
                    active:scale-95
                        rounded-lg">
                     Баланс
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
        </>
    )
}

