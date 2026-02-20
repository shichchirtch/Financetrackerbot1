import {createRoot} from 'react-dom/client'
import {Provider} from 'react-redux'
import {store} from './app/store'
import App from './App'
import './index.css'
import TelegramInitializer from "./TelegramInializer.jsx";


createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <TelegramInitializer/>
        <App/>
    </Provider>
)
