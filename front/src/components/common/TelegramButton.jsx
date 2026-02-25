// import {useTranslation} from "../../features/customHoock.js";


const SendReportToBot = {'ru':'Отправить отчёт боту',
'uk':'Надіслати звіт боту',
'de':'Senden einen Bericht an den Bot',
'tr':'Bota bir rapor gönder'}


function SendReportButton({ total, month, user_id, lan }) {
    // const { t } = useTranslation()
    async function handleClick() {

        if (!user_id) {
            alert("Открыто не в Telegram");
            return;
        }

        const payload = {
            user_id: user_id,
            type: "month_report",
            month: month,
            total: total,
        };
        console.log("payload =", payload)
        try {
            const res = await fetch("/api/report", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                throw new Error("Ошибка сервера");
            }

            // 👉 красиво закрываем мини-апп
            // tg.close();

        } catch (err) {
            console.error(err);
            alert("Error");
        }
    }

    return (
        <button
            onClick={handleClick}
            className="
                w-full py-3.5
                bg-cyan-600 rounded-lg
                font-bold text-gray-100
                active:scale-95 mt-5 border-2 border-gray-400
            "
        >
            {SendReportToBot[lan]}
        </button>
    );
}

export default SendReportButton;
