import { Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);


export default function ExpensesPie({ grouped, itog }) {

    const labels = Object.keys(grouped);
    const values = Object.values(grouped).map(v => v.total);

    const colors = [
        "#38bdf8",
        "#34d399",
        "#078A91",
        "#facc15",
        "#a78bfa",
        "#045559",
        "#12E3CF",
        "#027740",
        "#81A192",
        "#2A597D",
        "#0267B5",
        "#6A6BAB",
        "#131454",
        "#73AD2B",
        "#B0F7F7",
        "#855EAB",
        "#E673E1",
    ];

    const data = {
        labels,
        datasets: [
            {
                data: values,
                backgroundColor: colors,
            },
        ],
    };

    const options = {
        plugins: {
            legend: {
                display: false, // ⬅️ ВАЖНО: отключаем встроенную легенду
            },
            tooltip: {
                titleColor: "#fff",
                bodyColor: "#fff",
                backgroundColor: "#18181b",
            },
        },
        maintainAspectRatio: false,
    };

    const total = values.reduce((a, b) => a + b, 0);

    return (
        <div className="flex flex-col items-center">
            {/* Диаграмма */}
            <div className="w-[260px] h-[260px]">
                <Pie data={data} options={options} />
            </div>

            {/* Кастомная легенда */}
            <ul className="mt-4 space-y-2 text-sm text-gray-200 w-full font-semibold">
                {labels.map((label, i) => (
                    <li key={label} className="flex items-center gap-3">
            <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{backgroundColor: colors[i % colors.length]}}
            />
                        <span className="flex-1">{label}</span>
                        <span className="text-gray-300">
              {values[i]}
            </span>
                        <span className="text-gray-400">
        {Math.round((values[i] / total) * 100)}%
    </span>
                    </li>
                ))}
            </ul>
            <div>
                <br/>
                <p>$ Total :  {itog}</p>
            </div>

        </div>
    );
}
