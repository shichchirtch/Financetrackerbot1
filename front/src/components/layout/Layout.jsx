import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'


function Layout() {
    return (
        <div className="min-h-screen bg-zinc-950 flex justify-center">
            {/* контейнер приложения */}
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
    )
}

export default Layout





