import {Outlet} from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import {useDispatch} from "react-redux"
import {useEffect} from "react";
import {setUser, setLanguage} from "../../features/user/userSlice"
import {useTranslation} from "../../features/customHoock";
import {formPost} from "../../app/formPost.js";
import {formGet} from "../../app/formGet.js";
import {setCategories} from "../../features/category/categorySlice.js";
import {setCurrency} from "../../features/currency/currencySlice.js";

function Layout() {
    const wa = window.Telegram?.WebApp;
    const tgUser = wa?.initDataUnsafe?.user;

    const dispatch = useDispatch()

    const {t} = useTranslation()
    // 🔥 INIT USER
    console.log("Layout render, tgUser =", tgUser)
    useEffect(() => {

        if (!tgUser) return

        wa.ready();
        wa.expand();
        wa.setHeaderColor("#0f172a"); // твой slate-900
        wa.setBackgroundColor("#0f172a");

        async function initUser() {
            if (!tgUser) return;

            const front_user_dict = {
                user_id: tgUser.id,
                first_name: tgUser.first_name
            }

            try {
                const data = await formPost("/api/init", {
                    user_id: tgUser.id,
                    first_name: tgUser.first_name,
                    language_code: tgUser.language_code
                })
                console.log('DATA = ', data)
                dispatch(setUser(front_user_dict))
                dispatch(setLanguage(data.lan))

            } catch (err) {
                console.error("Init error:", err)
            }
            const categories = await formGet(`/api/categories/${tgUser.id}`);
            console.log("DATA CATEGORIES =", categories);
            dispatch(setCategories(categories.categories));

            const settings = await formGet(`/api/settings/${tgUser.id}`);

            dispatch(setCurrency(settings.currency));
        }

        initUser()
    }, [tgUser, dispatch])

    // ❌ НЕ из Telegram
    if (!wa || !tgUser) {
        return (
            <div className="min-h-screen bg-zinc-950 flex justify-center items-center">
                <div className="w-full max-w-[430px] bg-zinc-900 rounded-2xl p-6 text-center">
                    <h2 className="text-xl font-semibold mb-4 text-zinc-300">
                        {t("accessDeniedTitle")}
                    </h2>

                    <p className="mb-4 text-zinc-300">
                        {t("accessDeniedText")}
                    </p>

                    <a
                        href="https://t.me/financetrackerbot"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-4 px-6 py-3 bg-blue-500 text-white rounded-md"
                    >
                        👉 Открыть бота в Telegram
                    </a>
                </div>
            </div>
        );
    }

    // ✅ Открыто из Telegram
    return (
        <div className="min-h-[100svh] bg-zinc-950 flex justify-center pb-[env(safe-area-inset-bottom)]">
            <div
                className="
                    w-full
                    max-w-[430px]
                    bg-zinc-900
                    flex
                    flex-col
                    overflow-hidden
                "
            >
                <Header/>

                <main className="flex-1 flex overflow-y-auto justify-center">
                    <Outlet/>
                </main>

                <Footer/>
            </div>
        </div>
    );
}

export default Layout;








