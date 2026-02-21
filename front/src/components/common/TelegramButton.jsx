import { useTranslation } from "../../features/customHoock";

function SendReportButton({ total, month, userId }) {
    const t = useTranslation()
    async function handleClick() {

        if (!userId) {
            alert("Открыто не в Telegram");
            return;
        }

        const payload = {
            user_id: userId,
            type: "month_report",
            month: month,
            total: total,
        };

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
            alert("Не удалось отправить отчёт");
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
           {t('SendReportToBot')}
        </button>
    );
}

export default SendReportButton;
