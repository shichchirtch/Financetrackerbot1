import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { useTranslation } from "../../features/customHoock";

function Layout() {
    const wa =  '2'//window.Telegram?.WebApp?.initDataUnsafe
    const tgUser = '1' //wa?.initDataUnsafe?.user?.first_name

    const { t } = useTranslation()

    // ❌ НЕ из Telegram
    if (!wa || !tgUser) {
        return (
            <div className="min-h-screen bg-zinc-950 flex justify-center items-center">
                <div className="w-full max-w-[430px] bg-zinc-900 rounded-2xl p-6 text-center">
                    <h2 className="text-xl font-semibold mb-4 text-zinc-300">
                        {t('accessDeniedTitle')}
                    </h2>

                    <p className="mb-4 text-zinc-300">
                        {t('accessDeniedText')}
                    </p>

                    <a
                        href="https://t.me/financetrackerbot"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-4 px-6 py-3 bg-blue-500 text-white rounded-md"
                    >
                        {t("OpenBotInTelegram")}
                    </a>
                </div>
            </div>
        );
    }

    // ✅ Открыто из Telegram
    return (
        <div className="min-h-[100svh] bg-zinc-950 flex justify-center">
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
                <Header />

                <main className="flex-1 flex overflow-y-auto justify-center">
                    <Outlet />
                </main>

                <Footer />
            </div>
        </div>
    );
}

export default Layout;








