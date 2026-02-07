

export function groupIncomesByMonth(incomes) {
    const result = {}

    for (const income of incomes) {
        const date = new Date(income.date)
        const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`

        if (!result[monthKey]) {
            result[monthKey] = {
                items: [],
                total: 0,
            }
        }

        result[monthKey].items.push(income)
        result[monthKey].total += income.amount
    }

    return result
}



export function buildMonthReport(incomes) {
    let total = 0

    const items = [...incomes] // важно: не мутируем исходный массив
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map(income => {
            total += income.amount

            return {
                date: income.date,
                title: income.title || null,
                amount: income.amount,
            }
        })

    return {
        items,
        total,
    }
}

