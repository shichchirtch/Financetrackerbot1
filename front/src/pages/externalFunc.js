export function groupExpensesByCategory(trataList) {
    const result = {}

    function round2(value) {
        return Math.round(value * 100) / 100
    }


    for (const item of trataList) {
        const { category, title, price } = item

        if (!result[category]) {
            result[category] = {
                named: {},
                unnamedTotal: 0,
                total: 0,
            }
        }

        if (title) {
            if (!result[category].named[title]) {
                result[category].named[title] = 0
            }
            result[category].named[title] += price
        } else {
            result[category].unnamedTotal += price
        }

        result[category].total += price
        round2(result[category].total)
    }

    for (const category in result) {
        result[category].total = round2(result[category].total)
        result[category].unnamedTotal = round2(result[category].unnamedTotal)

        for (const title in result[category].named) {
            result[category].named[title] =
                round2(result[category].named[title])
        }
    }


    return result
}
