import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

function Layout() {
    const wa = window.Telegram?.WebApp;
    const tgUser = wa?.initDataUnsafe?.user;

    // ❌ НЕ из Telegram
    if (!wa || !tgUser) {
        return (
            <div className="min-h-screen bg-zinc-950 flex justify-center items-center">
                <div className="w-full max-w-[430px] bg-zinc-900 rounded-2xl p-6 text-center">
                    <h2 className="text-xl font-semibold mb-4 text-zinc-300">
                        🚫 Доступ ограничен
                    </h2>

                    <p className="mb-4 text-zinc-300">
                        Это веб-приложение можно использовать только через Telegram.
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
        <div className="min-h-screen bg-zinc-950 flex justify-center">
            <div
                className="
                    w-full
                    max-w-[430px]
                    max-h-[820px]
                    bg-zinc-900
                    flex
                    flex-col
                    rounded-2xl
                    overflow-hidden
                    mt-4
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








