export function groupExpensesByCategory(trataList) {
    const result = {}

    function round2(value) {
        return Math.round(value * 100) / 100
    }

    for (const item of trataList) {
        const { id, category, title, price, createdAt } = item

        if (!result[category]) {
            result[category] = {
                items: [],        // 🔥 храним реальные объекты
                total: 0,
            }
        }

        // 🔥 сохраняем оригинальный объект
        result[category].items.push({
            id,
            title,
            price,
            createdAt
        })

        result[category].total += price
    }

    // округляем total
    for (const category in result) {
        result[category].total = round2(result[category].total)
    }

    return result
}
