import {useState} from "react";

const SendReportToBot = {
    'ru': 'Отправить отчёт боту',
    'uk': 'Надіслати звіт боту',
    'de': 'Senden einen Bericht an den Bot',
    'tr': 'Bota bir rapor gönder'
}


const SuccessSend ={
    'ru':'Отчёт успешно отправлен !',
    'uk':'Звіт успішно надіслано!',
    'de':'Bericht erfolgreich gesendet!',
    'tr':'Rapor başarıyla gönderildi!'
}

function SendReportButton({ total, month, user_id, lan }) {

    const [send, setSend] = useState(false)
    const [loading, setLoading] = useState(false)

    async function handleClick() {

        if (!user_id) {
            alert("Открыто не в Telegram")
            return
        }

        try {
            setLoading(true)

            const res = await fetch("/api/report", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id,
                    month,
                    total
                }),
            })

            if (!res.ok) {
                throw new Error("Ошибка сервера")
            }

            setSend(true)

            const tg = window.Telegram?.WebApp

            setTimeout(() => {
                tg?.close()
            }, 2000)

        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full">
            <button
                onClick={handleClick}
                disabled={loading || send}
                className="
                    w-full py-3.5
                    bg-cyan-700 rounded-lg
                    font-bold text-gray-100
                    active:scale-95
                    border-2 border-gray-400
                    disabled:opacity-60
                "
            >
                {loading
                    ? "..."
                    : send
                        ? SuccessSend[lan]
                        : SendReportToBot[lan]}
            </button>

            {send && (
                <p className="text-green-400 text-lg text-center mt-3 animate-fadeIn">
                    {SuccessSend[lan]}
                </p>
            )}
        </div>
    )
}

export default SendReportButton;
